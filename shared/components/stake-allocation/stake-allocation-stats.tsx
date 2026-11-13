import { Grid, Skeleton, Stack, StatItem } from '@lidofinance/lido-app-ui';
import { INFO_TEST_ID } from 'shared/components/bond-stats-card/bond-stats-card';
import { FormatToken } from 'shared/formatters';
import { FC, ReactNode } from 'react';
import { pluralKeys } from 'utils';
import type { StakeAndKeysData } from 'utils/compute-stake-data';
import { LegendDot, LegendMarker } from './legend';
import { STAKE_LABELS, STAKE_TOOLTIPS } from './labels';
import { CompactStatItem } from './styles';

type Props = {
  data: StakeAndKeysData | undefined;
  size: 'summary' | 'member';
  error?: boolean;
};

export const SUMMARY_COLUMNS = {
  base: 'repeat(3, minmax(0, 260px))',
  mdDown: 1,
};
export const SUMMARY_GAP = { base: 8, mdDown: 16 } as const;

export const StakeAllocationStats: FC<Props> = ({ data, size, error }) => {
  const legendSize = size === 'summary' ? 24 : 20;
  const Item = size === 'summary' ? StatItem : CompactStatItem;

  const value = (amount: bigint | undefined): ReactNode => {
    if (error) return '—';
    if (!data) return <Skeleton variant="text" />;
    return (
      <FormatToken amount={amount} maxDecimalDigits={2} trimTrailingZeros />
    );
  };
  const keys = (count: number | undefined): ReactNode =>
    data && !error ? pluralKeys({ value: count, showValue: true }) : undefined;

  const items = (
    <>
      <Item
        align="left"
        label={STAKE_LABELS.active}
        titleIcon={<LegendDot color="success" size={legendSize} />}
        info={STAKE_TOOLTIPS.active}
        value={value(data?.activeStake)}
        subValue={keys(data?.activeKeys)}
        dataTestId={{
          ...INFO_TEST_ID,
          root: 'stakeColumnActive',
          subValue: 'stakeColumnActiveKeys',
        }}
      />
      <Item
        align="left"
        label={STAKE_LABELS.depositable}
        titleIcon={<LegendDot color="active" size={legendSize} />}
        info={STAKE_TOOLTIPS.depositable}
        value={value(data?.depositableStake)}
        subValue={keys(data?.depositableKeys)}
        dataTestId={{
          ...INFO_TEST_ID,
          root: 'stakeColumnDepositable',
          subValue: 'stakeColumnDepositableKeys',
        }}
      />
      <Item
        align="left"
        label={size === 'summary' ? 'Total Stake Allocation' : STAKE_LABELS.tsa}
        titleIcon={<LegendMarker size={legendSize} />}
        info={
          size === 'summary'
            ? 'Sum of the Target Stake Allocations of all Node Operators in the group'
            : STAKE_TOOLTIPS.tsa
        }
        value={value(data?.targetStake)}
        subValue={keys(data?.targetKeys)}
        dataTestId={{
          ...INFO_TEST_ID,
          root: 'stakeColumnTsa',
          subValue: 'stakeColumnTsaKeys',
        }}
      />
    </>
  );

  return size === 'summary' ? (
    <Grid columns={SUMMARY_COLUMNS} gap={SUMMARY_GAP}>
      {items}
    </Grid>
  ) : (
    <Stack direction="row" gap={20} wrap>
      {items}
    </Stack>
  );
};
