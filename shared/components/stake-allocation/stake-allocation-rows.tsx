import {
  InfoTooltip,
  Skeleton,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { pluralKeys } from 'utils';
import type { StakeAndKeysData } from 'utils/compute-stake-data';
import { STAKE_LABELS, STAKE_TOOLTIPS } from './labels';
import { LegendDot, LegendMarker } from './legend';

type Props = {
  data: StakeAndKeysData | undefined;
  error?: boolean;
};

const Amount = styled.span`
  min-width: 64px;
  text-align: right;
  font-size: var(--lido-app-ui-font-size-body);
  line-height: var(--lido-app-ui-line-height-body);
  font-weight: var(--lido-app-ui-font-weight-semibold);
  font-variant-numeric: tabular-nums;
`;

type RowProps = {
  testId: string;
  legend: ReactNode;
  label: string;
  tooltip: string;
  stake: bigint | undefined;
  keys: number | undefined;
  data: StakeAndKeysData | undefined;
  error?: boolean;
};

const Row: FC<RowProps> = ({
  testId,
  legend,
  label,
  tooltip,
  stake,
  keys,
  data,
  error,
}) => {
  const amount = error ? (
    '—'
  ) : !data ? (
    <Skeleton variant="text" />
  ) : (
    <FormatToken
      amount={stake}
      maxDecimalDigits={2}
      trimTrailingZeros
      symbol=""
    />
  );

  return (
    <Stack
      direction="row"
      justify="between"
      align="center"
      style={{ minHeight: 28 }}
      data-testid={testId}
    >
      <Stack direction="row" gap={8} align="center">
        {legend}
        <Typography variant="body">{label}</Typography>
        <InfoTooltip
          size={16}
          content={tooltip}
          dataTestId={ICON_TOOLTIP_TEST_ID}
        />
      </Stack>
      <Stack direction="row" gap={12} align="center">
        {data && !error && (
          <Typography
            variant="body"
            color="tertiary"
            data-testid={`${testId}Keys`}
          >
            {pluralKeys({ value: keys, showValue: true })}
          </Typography>
        )}
        <Amount>{amount}</Amount>
      </Stack>
    </Stack>
  );
};

export const StakeAllocationRows: FC<Props> = ({ data, error }) => (
  <Stack direction="column" gap={8}>
    <Row
      testId="stakeColumnActive"
      legend={<LegendDot color="success" size={20} />}
      label={STAKE_LABELS.active}
      tooltip={STAKE_TOOLTIPS.active}
      stake={data?.activeStake}
      keys={data?.activeKeys}
      data={data}
      error={error}
    />
    <Row
      testId="stakeColumnDepositable"
      legend={<LegendDot color="active" size={20} />}
      label={STAKE_LABELS.depositable}
      tooltip={STAKE_TOOLTIPS.depositable}
      stake={data?.depositableStake}
      keys={data?.depositableKeys}
      data={data}
      error={error}
    />
    <Row
      testId="stakeColumnTsa"
      legend={<LegendMarker size={20} />}
      label={STAKE_LABELS.tsa}
      tooltip={STAKE_TOOLTIPS.tsa}
      stake={data?.targetStake}
      keys={data?.targetKeys}
      data={data}
      error={error}
    />
  </Stack>
);
