import { Divider, Text } from '@lidofinance/lido-ui';
import { differenceInCalendarDays, format, fromUnixTime } from 'date-fns';
import { FC } from 'react';
import { GrayText, Stack, TextBlock, TxLinkEtherscan } from 'shared/components';
import {
  getNextRewardsFrame,
  getPrevRewardsFrame,
  useLastOperatorRewards,
  useLastRewardsSlot,
  useLastRewrdsTx,
} from 'shared/hooks/useLastRewardsFrame';
import { Balance } from './balance';
import {
  AccordionStyle,
  BadgeStyle,
  RowBody,
  RowHeader,
  RowTitle,
} from './styles';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useNodeOperatorInfo } from 'shared/hooks';

export const percent = (value?: number) => Math.round((value ?? 0) * 1000) / 10;
export const formatDate = (timestamp?: number) =>
  timestamp ? format(fromUnixTime(timestamp), 'MMM dd') : null;

// TODO: "why?"
// TODO: tooltips

export const LastRewards: FC = () => {
  const { data: lastRewards, initialLoading: isLoading } =
    useLastOperatorRewards();

  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);

  const { data: rewardsSlot } = useLastRewardsSlot();
  const { data: txHash } = useLastRewrdsTx();

  const lastRewardsFrame = rewardsSlot?.timestamp
    ? formatDate(rewardsSlot.timestamp)
    : null;
  const prevRewardsFrame = rewardsSlot?.timestamp
    ? formatDate(getPrevRewardsFrame(rewardsSlot.timestamp))
    : null;
  const nextRewardsFrame = rewardsSlot?.timestamp
    ? formatDate(getNextRewardsFrame(rewardsSlot.timestamp))
    : null;

  const daysLeft = rewardsSlot?.timestamp
    ? differenceInCalendarDays(
        fromUnixTime(getNextRewardsFrame(rewardsSlot.timestamp)),
        new Date(),
      )
    : null;

  const overThresholdRate = lastRewards?.validatorsCount
    ? (lastRewards?.validatorsOverTresholdCount ?? 0) /
      lastRewards?.validatorsCount
    : 0;

  const showThisSection = lastRewards || (info?.totalDepositedKeys ?? 0) > 0;

  if (!showThisSection) return null;

  return (
    <AccordionStyle
      summary={
        <RowHeader>
          <Stack direction="column" gap="xxs">
            <RowTitle>Last rewards frame</RowTitle>
            {prevRewardsFrame && lastRewardsFrame && (
              <Stack center gap="sm" wrap>
                <GrayText>
                  {prevRewardsFrame} — {lastRewardsFrame}
                </GrayText>
                {txHash && (
                  <Text size="xxs">
                    <TxLinkEtherscan txHash={txHash} />
                  </Text>
                )}
              </Stack>
            )}
          </Stack>
          <Balance big loading={isLoading} amount={lastRewards?.distributed} />
        </RowHeader>
      }
    >
      <Stack direction="column" gap="lg">
        <RowBody>
          <TextBlock
            title="Keys over threshold"
            loading={isLoading}
            description={`Threshold: ${percent(lastRewards?.threshold)}%`}
          >
            {lastRewards?.validatorsOverTresholdCount}{' '}
            <i>/{lastRewards?.validatorsCount}</i>
          </TextBlock>
          <TextBlock
            title="Stuck keys found"
            loading={false}
            warning={lastRewards?.stuck}
          >
            {lastRewards?.stuck ? 'YES' : 'NO'}
          </TextBlock>
          <TextBlock
            title="You received"
            loading={isLoading}
            description="of potential rewards"
          >
            {percent(overThresholdRate)}%
          </TextBlock>
        </RowBody>
        <Divider />
        <Stack spaceBetween center>
          <Stack direction="column" gap="xxs">
            <Text size="xs" weight={700}>
              Next rewards frame
            </Text>
            <GrayText>
              {lastRewardsFrame} — {nextRewardsFrame}
            </GrayText>
          </Stack>
          {daysLeft !== null &&
            (daysLeft < 0 ? (
              <BadgeStyle $variant="warning">
                Oracle report is delayed
              </BadgeStyle>
            ) : (
              <BadgeStyle>{daysLeft} days left</BadgeStyle>
            ))}
        </Stack>
      </Stack>
    </AccordionStyle>
  );
};
