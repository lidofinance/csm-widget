import { Grid, Input } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatPercentInput } from 'shared/hook-form/fields/percent-input';

const COLUMNS = { base: 'minmax(0, 1fr) 120px', xsDown: 'minmax(0, 1fr) 96px' };

type ShareRowViewProps = {
  label: string;
  value: string;
  description?: string;
  share: bigint;
  'data-testid'?: string;
};

export const ShareRowView: FC<ShareRowViewProps> = ({
  label,
  value,
  description,
  share,
  'data-testid': dataTestId,
}) => (
  <Grid columns={COLUMNS} gap={12} align="end" data-testid={dataTestId}>
    <Input readOnly label={label} value={value} description={description} />
    <Input readOnly label="Share, %" value={formatPercentInput(share)} />
  </Grid>
);
