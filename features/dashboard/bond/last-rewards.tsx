import {
  Box,
  Divider,
  InlineLoader,
  Modal,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import { ModalComponentType, useModal } from 'providers/modal-provider';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC, useCallback } from 'react';
import {
  GrayText,
  Plural,
  Stack,
  TextBlock,
  TxLinkEtherscan,
} from 'shared/components';
import { FaqElement } from 'shared/components/faq/styles';
import {
  useLastOperatorRewards,
  useLastRewrdsTx,
  useNodeOperatorInfo,
  useRewardsFrame,
  useSharesToSteth,
} from 'shared/hooks';
import { countDaysLeft, formatDate, formatPercent } from 'utils';
import { Balance } from './balance';
import {
  AccordionStyle,
  BadgeStyle,
  DoubleColumnStyle,
  RowBody,
  RowHeader,
  RowTitle,
} from './styles';
import { Zero } from '@ethersproject/constants';

export const LastRewards: FC = () => {
  const { data: lastRewards, initialLoading: isLoading } =
    useLastOperatorRewards();
  const { data: distributed, initialLoading: isDistributedLoading } =
    useSharesToSteth(lastRewards?.distributed);

  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);

  const { data: rewardsFrame } = useRewardsFrame();

  const lastRewardsDate = formatDate(rewardsFrame?.lastRewards);
  const prevRewardsDate = formatDate(rewardsFrame?.prevRewards);
  const nextRewardsDate = formatDate(rewardsFrame?.nextRewards);
  const daysLeft = countDaysLeft(rewardsFrame?.nextRewards);

  const showThisSection = lastRewards || (info?.totalDepositedKeys ?? 0) > 0;

  const showWhy = lastRewards && lastRewards.distributed.isZero();

  if (!showThisSection) return null;

  return (
    <AccordionStyle
      data-testid="lastRewardsBlock"
      summary={
        <RowHeader>
          <Stack direction="column" gap="xxs" data-testid="rowHeader">
            <RowTitle>Latest rewards distribution</RowTitle>
            {prevRewardsDate && lastRewardsDate && (
              <GrayText data-testid="reportFrame">
                Report frame: {prevRewardsDate} — {lastRewardsDate}
              </GrayText>
            )}
          </Stack>
          <Balance
            data-testid="commonBalance"
            big
            loading={isLoading || isDistributedLoading}
            amount={distributed ?? Zero}
            description={showWhy ? <Why /> : undefined}
          />
        </RowHeader>
      }
    >
      <Stack direction="column" gap="lg">
        <LastReportStats />
        <Divider />
        <Stack spaceBetween center data-testid="nextRewardsInfo">
          <Stack direction="column" gap="xxs">
            <Text size="xs" weight={700}>
              Next rewards distribution
            </Text>
            {lastRewardsDate && nextRewardsDate ? (
              <GrayText data-testid="reportFrame">
                Report frame: {lastRewardsDate} — {nextRewardsDate}
              </GrayText>
            ) : (
              <InlineLoader />
            )}
          </Stack>
          {daysLeft !== null &&
            (daysLeft < 0 ? (
              <BadgeStyle $variant="warning">
                Oracle report is delayed
              </BadgeStyle>
            ) : (
              <Stack center gap="xs" data-testid="expectedDays">
                <GrayText>Expected</GrayText>
                <BadgeStyle>
                  {daysLeft === 0 ? (
                    'Today'
                  ) : (
                    <>
                      in {daysLeft}{' '}
                      <Plural variants={['day', 'days']} value={daysLeft} />
                    </>
                  )}
                </BadgeStyle>
              </Stack>
            ))}
        </Stack>
      </Stack>
    </AccordionStyle>
  );
};

const LastReportStats: FC = () => {
  const { data: lastRewards, initialLoading: isLoading } =
    useLastOperatorRewards();
  const { data: txHash, initialLoading: isTxLoading } = useLastRewrdsTx();

  return (
    <RowBody data-testid="lastRewardsInfo">
      {!lastRewards || lastRewards.validatorsCount ? (
        <>
          {' '}
          <TextBlock
            title="Keys over threshold"
            loading={isLoading}
            description={
              <Tooltip title={lastRewards?.threshold} placement="bottomLeft">
                <span>Threshold: {formatPercent(lastRewards?.threshold)}%</span>
              </Tooltip>
            }
            help="Number of your keys above the performance threshold in the latest report frame"
          >
            {lastRewards?.validatorsOverThresholdCount}{' '}
            <i>/{lastRewards?.validatorsCount}</i>
          </TextBlock>
          <TextBlock
            title="Stuck keys found"
            loading={isLoading}
            warning={lastRewards?.stuck}
            help="Indicates whether any of your Node Operator keys were marked as “Stuck” during the latest report frame. Stuck keys prevent the Node Operator from receiving rewards for any key(s) in that frame"
          >
            {lastRewards?.stuck ? 'YES' : 'NO'}
          </TextBlock>
        </>
      ) : (
        <DoubleColumnStyle>
          <TextBlock title="You had no active keys during the latest rewards frame" />
        </DoubleColumnStyle>
      )}

      <TextBlock title="Distribution transaction" loading={isTxLoading}>
        <Box as="span" fontWeight={400}>
          <TxLinkEtherscan txHash={txHash} />
        </Box>
      </TextBlock>
    </RowBody>
  );
};

const Why: FC = () => {
  const { openModal } = useModal(WhyModal);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      openModal({});
      event.stopPropagation();
    },
    [openModal],
  );
  return (
    <Text size="xxs" color="primary" onClick={handleClick}>
      Why?
    </Text>
  );
};

export const WhyModal: ModalComponentType = ({ ...props }) => (
  <Modal {...props} title="Why didn’t I get rewards?" data-testid="whyModal">
    <FaqElement>
      <p>There are two main reasons of you getting no reward within a frame:</p>
      <ol>
        <li>
          If your validator’s performance was below the threshold within the CSM
          Performance Oracle frame (7 days for testnet) the validator does not
          receive rewards for the given frame. Read more about{' '}
          <a
            href="https://operatorportal.lido.fi/modules/community-staking-module#block-c6dc8d00f13243fcb17de3fa07ecc52c"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            the CSM Performance Oracle
          </a>
          .
        </li>
        <li>
          <a
            href="https://operatorportal.lido.fi/modules/community-staking-module#block-0ed61a4c0a5a439bbb4be20e814b4e38"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Your Node Operator has stuck keys
          </a>{' '}
          due to not exiting a validator requested for exit timely.
        </li>
      </ol>
    </FaqElement>
  </Modal>
);
