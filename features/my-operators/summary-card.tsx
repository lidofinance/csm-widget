import {
  Grid,
  Skeleton,
  Stack,
  StatItem,
  Typography,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { CSM_FAMILY_MODULES } from 'consts';
import { FC, useId } from 'react';
import { StretchCard } from 'shared/components';
import {
  SUMMARY_COLUMNS,
  SUMMARY_GAP,
} from 'shared/components/stake-allocation';
import { INFO_TEST_ID } from 'shared/components/bond-stats-card/bond-stats-card';
import { UsdValue } from 'shared/components/bond-stats-card/usd-value';
import { FormatToken } from 'shared/formatters';
import { useMyOperatorsOverview } from 'shared/hooks';
import { ActiveKeysValue, IssuesTag } from './parts';

export const MyOperatorsSummaryCard: FC = () => {
  const {
    activeValidators,
    liveKeys,
    activeBalance,
    availableToClaim,
    bondBalance,
    totalIssues,
    isPending,
  } = useMyOperatorsOverview({ modules: CSM_FAMILY_MODULES });
  const titleId = useId();
  const loading = <Skeleton variant="text" />;

  return (
    <StretchCard
      dataTestId={{ root: 'myOperatorsSummary' }}
      aria-labelledby={titleId}
    >
      <Stack direction="row" justify="between" align="center" gap={16} wrap>
        <Typography variant="h3" as="p" id={titleId}>
          My operators summary
        </Typography>
        <IssuesTag
          count={isPending ? undefined : totalIssues}
          dataTestId="summaryIssuesChip"
        />
      </Stack>
      <Grid columns={SUMMARY_COLUMNS} gap={SUMMARY_GAP}>
        <StatItem
          align="left"
          label="Active keys"
          info="Active keys out of all non-withdrawn keys across your operators"
          dataTestId={{ ...INFO_TEST_ID, root: 'summaryActiveValidators' }}
          value={
            isPending ? (
              loading
            ) : (
              <ActiveKeysValue
                active={activeValidators}
                total={liveKeys}
                spaced
              />
            )
          }
          subValue={
            isPending ? undefined : (
              <FormatToken
                amount={activeBalance}
                token={TOKENS.eth}
                maxDecimalDigits={2}
                trimTrailingZeros
                fallback=""
              />
            )
          }
        />
        <StatItem
          align="left"
          label="Total balance, stETH"
          info="Total bond held by your operators across the CSM modules"
          dataTestId={{
            ...INFO_TEST_ID,
            root: 'summaryBondBalance',
            value: 'textContent',
          }}
          value={
            isPending ? (
              loading
            ) : (
              <FormatToken amount={bondBalance} maxDecimalDigits={4} />
            )
          }
          subValue={
            isPending ? undefined : (
              <UsdValue amount={bondBalance} approx={false} />
            )
          }
        />
        <StatItem
          align="left"
          label="Available to claim, stETH"
          info="The amount you can claim now, including rewards and excess bond across your operators"
          dataTestId={{ ...INFO_TEST_ID, root: 'summaryAvailableToClaim' }}
          value={
            isPending ? (
              loading
            ) : (
              <FormatToken amount={availableToClaim} maxDecimalDigits={4} />
            )
          }
          subValue={
            isPending ? undefined : (
              <UsdValue amount={availableToClaim} approx={false} />
            )
          }
        />
      </Grid>
    </StretchCard>
  );
};
