import { Body, Grid, Input } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatPercentInput } from 'shared/hook-form/fields/percent-input';
import s from './split-row-view.module.css';

type ShareRowViewProps = {
  label: string;
  value: string;
  share: bigint;
  'data-testid'?: string;
};

export const ShareRowView: FC<ShareRowViewProps> = ({
  label,
  value,
  share,
  'data-testid': dataTestId,
}) => (
  <Grid columns="minmax(0, 1fr) 120px" gap={12} data-testid={dataTestId}>
    <Input
      className={s.addressInput}
      readOnly
      aria-label={label}
      value={value}
    />
    <Input
      className={s.shareInput}
      readOnly
      aria-label={`${label} share, %`}
      value={formatPercentInput(share)}
      trailing={<Body color="secondary">%</Body>}
    />
  </Grid>
);
