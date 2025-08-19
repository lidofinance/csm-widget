import {
  Box,
  Divider,
  InlineLoader,
  Modal,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import {
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorLastRewards,
  useFrameInfo,
  useRewardsLastReportTxHash,
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
import {
  LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE,
  LIDO_OPERATOR_PORTAL_STUCK_KEYS,
} from 'consts/external-links';
import { FaqElement } from 'shared/components/faq/styles';
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

export const LastRewards: FC = () => {
  const id = useNodeOperatorId();

  const { data: info } = useOperatorInfo(id);
  const { data: lastRewards, isPending: isLoading } =
    useOperatorLastRewards(id);
  const { data: rewardsFrame } = useFrameInfo((data) => ({
    lastDistribution: data.lastReport,
    prevDistribution: data.lastReport - data.frameDuration,
    nextDistribution: data.lastReport + data.frameDuration,
  }));

  const lastRewardsDate = formatDate(rewardsFrame?.lastDistribution);
  const prevRewardsDate = formatDate(rewardsFrame?.prevDistribution);
  const nextRewardsDate = formatDate(rewardsFrame?.nextDistribution);
  const daysLeft = countDaysLeft(rewardsFrame?.nextDistribution);

  const showThisSection = lastRewards || (info?.totalDepositedKeys ?? 0) > 0;

  const showWhy = lastRewards && lastRewards.distributed === 0n;

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
  const nodeOperatorId = useNodeOperatorId();
  const { data: lastRewards, isPending: isLoading } =
    useOperatorLastRewards(nodeOperatorId);
  const { data: txHash, isPending: isTxLoading } = useRewardsLastReportTxHash();

  return (
    <RowBody data-testid="lastRewardsInfo">
      {!lastRewards || lastRewards.validatorsCount ? (
        <>
          {' '}
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
          <FaqLink href={LIDO_OPERATOR_PORTAL_PERFORMANCE_ORACLE}>
            the CSM Performance Oracle
          </FaqLink>
          .
        </li>
        <li>
          <FaqLink href={LIDO_OPERATOR_PORTAL_STUCK_KEYS}>
            Your Node Operator has stuck keys
          </FaqLink>{' '}
          due to not exiting a validator requested for exit timely.
        </li>
      </ol>
    </FaqElement>
  </Modal>
);
