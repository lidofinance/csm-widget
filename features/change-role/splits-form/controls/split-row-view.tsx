import { Body, Grid, Input } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatPercentInput } from 'shared/hook-form/fields/percent-input';
import styled from 'styled-components';

const ShareInputStyle = styled(Input)`
  && input {
    text-align: right;
  }
`;

const AddressInputStyle = styled(Input)`
  && input {
    text-overflow: ellipsis;
  }
`;

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
    <AddressInputStyle readOnly aria-label={label} value={value} />
    <ShareInputStyle
      readOnly
      aria-label={`${label} share, %`}
      value={formatPercentInput(share)}
      trailing={<Body color="secondary">%</Body>}
    />
  </Grid>
);
