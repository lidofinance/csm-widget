import { Grid, Input } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatPercentInput } from 'shared/hook-form/fields/percent-input';
import {
  PercentSuffixStyle,
  TrailingInputStyle,
} from 'shared/hook-form/fields/styles';
import styled from 'styled-components';

const ShareInputStyle = styled(TrailingInputStyle)`
  && input {
    text-align: right;
  }
`;

const AddressInputStyle = styled(Input)`
  && input {
    text-overflow: ellipsis;
  }
`;

const COLUMNS = {
  base: 'minmax(0, 1fr) 120px',
  smDown: 'minmax(0, 1fr) 120px',
};

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
  <Grid columns={COLUMNS} gap={12} data-testid={dataTestId}>
    <AddressInputStyle readOnly aria-label={label} value={value} />
    <ShareInputStyle
      $trailing
      readOnly
      aria-label={`${label} share, %`}
      value={formatPercentInput(share)}
      icon={<PercentSuffixStyle>%</PercentSuffixStyle>}
    />
  </Grid>
);
