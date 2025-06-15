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
  useRewardsFrame,
  useRewardsLastReportTxHash,
} from 'modules/web3';
import { ModalComponentType, useModal } from 'providers/modal-provider';
import { FC, useCallback } from 'react';
import {
  GrayText,
  Plural,
  Stack,
  TextBlock,
  TxLinkEtherscan,
} from 'shared/components';
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
  const { data: rewardsFrame } = useRewardsFrame();

  const lastRewardsDate = formatDate(rewardsFrame?.lastDistribution);
  const prevRewardsDate = formatDate(rewardsFrame?.prevDistribution);
  const nextRewardsDate = formatDate(rewardsFrame?.nextDistribution);
  const daysLeft = countDaysLeft(rewardsFrame?.nextDistribution);

  const showThisSection = lastRewards || (info?.totalDepositedKeys ?? 0) > 0;

  const showWhy = lastRewards && lastRewards.distributed === 0n;

  if (!showThisSection) return null;

  return (
    <AccordionStyle
      summary={
        <RowHeader>
          <Stack direction="column" gap="xxs">
            <RowTitle>Latest rewards distribution</RowTitle>
            {prevRewardsDate && lastRewardsDate && (
              <GrayText>
                Report frame: {prevRewardsDate} — {lastRewardsDate}
              </GrayText>
            )}
          </Stack>
          <Balance
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
        <Stack spaceBetween center>
          <Stack direction="column" gap="xxs">
            <Text size="xs" weight={700}>
              Next rewards distribution
            </Text>
            {lastRewardsDate && nextRewardsDate ? (
              <GrayText>
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
              <Stack center gap="xs">
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
  const { data: lastRewards, isPending: isLoading } = useOperatorLastRewards();
  const { data: txHash, isPending: isTxLoading } = useRewardsLastReportTxHash();

  return (
    <RowBody>
      {!lastRewards || lastRewards.validatorsCount ? (
        <>
          {' '}
          <TextBlock
            title="Keys over threshold"
            loading={isLoading}
            description={
              <Tooltip title={lastRewards?.threshold} placement="bottomLeft">
                <span>Threshold: {formatPercent(lastRewards?.threshold)}</span>
              </Tooltip>
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
  <Modal {...props} title="Why didn’t I get rewards?">
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
      </ol>
    </FaqElement>
  </Modal>
);
