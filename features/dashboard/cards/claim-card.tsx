import {
  Divider,
  Grid,
  Skeleton,
  Stack,
  StatCard,
  StatItem,
  TextLink,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useFeeSplits, useModule, useNodeOperatorId } from 'modules/web3';
import { useModal } from 'providers/modal-provider';
import { FC, MouseEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { EtherscanTxLink } from 'shared/components/external-icon-link';
import { UsdValue } from 'shared/components/bond-stats-card/usd-value';
import { useBondStats } from 'shared/components/bond-stats-card/use-bond-stats';
import { FormatToken } from 'shared/formatters';
import {
  calculateAvailableToClaim,
  formatDate,
  formatPercent,
  trackMatomoEvent,
} from 'utils';
import { useLatestDistribution } from '../hooks/use-latest-distribution';
import { getNextDistributionLabel } from '../utils/get-next-distribution-label';
import { WhyModal } from './why-modal';

const DistributionStatItem = styled(StatItem)`
  && [class*='StatItem-module_label'] {
    font-size: var(--lido-app-ui-font-size-label);
    line-height: var(--lido-app-ui-line-height-label);
    color: var(--lido-app-ui-color-text-tertiary);
  }

  && [class*='StatItem-module_value'] {
    font-size: var(--lido-app-ui-font-size-label);
    line-height: var(--lido-app-ui-line-height-label);
    font-weight: var(--lido-app-ui-font-weight-semibold);
    color: var(--lido-app-ui-color-text-secondary);
  }

  && [class*='StatItem-module_description'] {
    font-size: var(--lido-app-ui-font-size-tooltip);
    line-height: var(--lido-app-ui-line-height-description);
    color: var(--lido-app-ui-color-text-tertiary);
  }
`;

const TxLinkSlot = styled.span`
  display: inline-flex;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FRAME_DIVIDER_STYLE = { height: 12, alignSelf: 'center' } as const;

const SubRow: FC<{ children: ReactNode }> = ({ children }) => (
  <Stack direction="row" gap={8} align="center" wrap>
    {children}
  </Stack>
);

const LatestDistribution: FC = () => {
  const { isCsmFamily } = useModule();
  const { openModal } = useModal(WhyModal);
  const { lastRewards, prevStart, frame, txHash, isPending, isFrameError } =
    useLatestDistribution();

  const hasReport = !!prevStart;
  const reportFrame =
    prevStart && frame
      ? `${formatDate(prevStart)} — ${formatDate(frame.lastReport)}`
      : undefined;

  const info = reportFrame ? (
    <Stack direction="column" gap={8}>
      <span>Report frame: {reportFrame}</span>
      {isCsmFamily && lastRewards?.validatorsCount ? (
        <span>
          Keys over threshold: {lastRewards.validatorsOverThresholdCount}/
          {lastRewards.validatorsCount}
        </span>
      ) : null}
      {isCsmFamily && lastRewards?.validatorsCount === 0 && (
        <span>You had no active keys during the latest rewards frame</span>
      )}
      {isCsmFamily && !!lastRewards?.threshold && (
        <span>Threshold: {formatPercent(lastRewards.threshold)}</span>
      )}
    </Stack>
  ) : undefined;

  let value: ReactNode;
  if (isPending) {
    value = <Skeleton variant="text" />;
  } else if (!hasReport || lastRewards == null) {
    value = '—';
  } else if (lastRewards.distributed === 0n) {
    value = (
      <Stack direction="row" gap={8} align="center">
        0
        <TextLink
          href="#"
          role="button"
          onClick={(event: MouseEvent) => {
            event.preventDefault();
            openModal({});
          }}
          dataTestId={{ root: 'whyLink' }}
        >
          Why?
        </TextLink>
      </Stack>
    );
  } else {
    value = (
      <>
        +<FormatToken amount={lastRewards.distributed} token={TOKENS.steth} />
      </>
    );
  }

  const showDescription =
    !isPending && !isFrameError && !!lastRewards && !!reportFrame;

  return (
    <DistributionStatItem
      align="left"
      label="Latest distribution"
      info={info}
      value={value}
      description={
        showDescription ? (
          <SubRow>
            <UsdValue amount={lastRewards.distributed} approx={false} />
            <Divider orientation="vertical" style={FRAME_DIVIDER_STYLE} />
            <span data-testid="reportFrame">{reportFrame}</span>
            {txHash && (
              <>
                <Divider orientation="vertical" style={FRAME_DIVIDER_STYLE} />
                <TxLinkSlot>
                  <EtherscanTxLink
                    txHash={txHash}
                    data-testid="distributionTxLink"
                  />
                </TxLinkSlot>
              </>
            )}
          </SubRow>
        ) : undefined
      }
      dataTestId={{
        root: 'lastRewardsBlock',
        value: 'rowHeader',
        info: 'iconTooltip',
        infoContent: 'lastRewardsInfo',
      }}
    />
  );
};

const NextDistribution: FC = () => {
  const { frame, isFramePending, isFrameError } = useLatestDistribution();

  let value: ReactNode = '—';
  if (frame) {
    value = getNextDistributionLabel({
      nextReport: frame.nextReport,
      now: new Date(),
    });
  } else if (isFramePending) {
    value = <Skeleton variant="text" />;
  }

  return (
    <DistributionStatItem
      align="left"
      label="Next distribution"
      value={value}
      description={
        frame && !isFrameError
          ? `${formatDate(frame.lastReport)} — ${formatDate(frame.nextReport)}`
          : undefined
      }
      dataTestId={{
        root: 'nextRewardsInfo',
        value: 'expectedDays',
        description: 'nextReportFrame',
      }}
    />
  );
};

export const ClaimCard: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { bond, rewards, isPending } = useBondStats();
  const { data: feeSplits } = useFeeSplits({ nodeOperatorId });

  const availableToClaim = calculateAvailableToClaim({
    bond,
    rewards,
    feeSplits,
  });

  return (
    <StatCard
      title="Available to claim, stETH"
      info="The amount you can claim now, including rewards and excess bond"
      link={{
        label: 'Claim',
        href: PATH.BOND_CLAIM,
        onClick: () =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.dashboardClaimLink),
      }}
      value={
        isPending ? (
          <Skeleton variant="text" />
        ) : (
          <FormatToken
            amount={bond ? availableToClaim : undefined}
            token={TOKENS.steth}
            symbol=""
            fallback="—"
            trimTrailingZeros
          />
        )
      }
      secondary={
        !isPending && bond ? (
          <UsdValue amount={availableToClaim} approx={false} />
        ) : undefined
      }
      footer={
        <Grid columns={2} gap={16}>
          <LatestDistribution />
          <NextDistribution />
        </Grid>
      }
      dataTestId={{
        root: 'availableToClaimBlock',
        link: 'sectionHeaderLink',
        value: 'availableToClaimBalance',
      }}
    />
  );
};
