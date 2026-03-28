import {
  Box,
  Divider,
  InlineLoader,
  Modal,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import { LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE } from 'consts/external-links';
import { isModuleCM } from 'consts/module';
import {
  useFrameInfo,
  useLastReportTimestamps,
  useLastReportTxHash,
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorLastRewards,
} from 'modules/web3';
import { ModalComponentType, useModal } from 'providers/modal-provider';
import { FC, useCallback } from 'react';
import {
  FaqLink,
  GrayText,
  Plural,
  Stack,
  TextBlock,
  TxLinkEtherscan,
} from 'shared/components';
import { FaqElement } from 'shared/components/faq/styles';
import {
  countCalendarDaysLeft,
  formatDate,
  formatPercent,
  isDayInPast,
} from 'utils';
import { Balance } from './balance';
import {
  AccordionStyle,
  BadgeStyle,
  DoubleColumnStyle,
  RowBody,
  RowHeader,
  RowTitle,
} from './styles';

export const LastRewards: FC = () => {
  const id = useNodeOperatorId();

  const { data: info } = useOperatorInfo(id);
  const { data: lastRewards, isPending: isLoading } =
    useOperatorLastRewards(id);
  const { data: rewardsFrame } = useFrameInfo((data) => ({
    lastDistribution: formatDate(data.lastReport),
    nextDistribution: formatDate(data.nextReport),
    daysLeft: countCalendarDaysLeft(data.nextReport),
    isDelayed: isDayInPast(data.nextReport),
  }));
  const { data: prevDistribution } = useLastReportTimestamps((data) =>
    formatDate(data?.start),
  );

  const showThisSection =
    prevDistribution && (lastRewards || (info?.totalDepositedKeys ?? 0) > 0);

  const showWhy = lastRewards && lastRewards.distributed === 0n;

  if (!showThisSection) return null;

  return (
    <AccordionStyle
      data-testid="lastRewardsBlock"
      summary={
        <RowHeader>
          <Stack direction="column" gap="xxs" data-testid="rowHeader">
            <RowTitle>Latest rewards distribution</RowTitle>
            {prevDistribution && rewardsFrame && (
              <GrayText data-testid="reportFrame">
                Report frame: {prevDistribution} —{' '}
                {rewardsFrame.lastDistribution}
              </GrayText>
            )}
          </Stack>
          <Balance
            data-testid="commonBalance"
            big
            loading={isLoading}
            amount={lastRewards?.distributed}
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
            {rewardsFrame ? (
              <GrayText data-testid="reportFrame">
                Report frame: {rewardsFrame.lastDistribution} —{' '}
                {rewardsFrame.nextDistribution}
              </GrayText>
            ) : (
              <InlineLoader />
            )}
          </Stack>
          {rewardsFrame &&
            (rewardsFrame.isDelayed ? (
              <BadgeStyle $variant="warning">
                Oracle report is delayed
              </BadgeStyle>
            ) : (
              <Stack center gap="xs" data-testid="expectedDays">
                <GrayText>Expected</GrayText>
                <BadgeStyle>
                  {rewardsFrame.daysLeft === 0 ? (
                    'Today'
                  ) : (
                    <>
                      in {rewardsFrame.daysLeft}{' '}
                      <Plural
                        variants={['day', 'days']}
                        value={rewardsFrame.daysLeft}
                      />
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
  const nodeOperatorId = useNodeOperatorId();
  const { data: lastRewards, isPending: isLoading } =
    useOperatorLastRewards(nodeOperatorId);
  const { data: txHash, isPending: isTxLoading } = useLastReportTxHash();

  return (
    <RowBody data-testid="lastRewardsInfo">
      {!isModuleCM &&
        (!lastRewards || lastRewards.validatorsCount ? (
          <TextBlock
            title="Keys over threshold"
            loading={isLoading}
            description={
              lastRewards?.threshold ? (
                <Tooltip title={lastRewards?.threshold} placement="bottomLeft">
                  <span>
                    Threshold: {formatPercent(lastRewards?.threshold)}
                  </span>
                </Tooltip>
              ) : null
            }
            help="Number of your keys above the performance threshold in the latest report frame"
          >
            {lastRewards?.validatorsOverThresholdCount}{' '}
            <i>/{lastRewards?.validatorsCount}</i>
          </TextBlock>
        ) : (
          <DoubleColumnStyle>
            <TextBlock title="You had no active keys during the latest rewards frame" />
          </DoubleColumnStyle>
        ))}

      <TextBlock title="Distribution transaction" loading={isTxLoading}>
        <Box as="span" fontWeight={400} fontSize={12}>
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
      <p>There are main reason of you getting no reward within a frame:</p>
      <ol>
        <li>
          If your validator’s performance was below the threshold within the CSM
          Performance Oracle frame the validator does not receive rewards for
          the given frame. Read more about{' '}
          <FaqLink href={LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE}>
            the CSM Performance Oracle
          </FaqLink>
          .
        </li>
      </ol>
    </FaqElement>
  </Modal>
);
