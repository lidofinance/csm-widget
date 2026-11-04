import { Input } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatPercentInput } from 'shared/hook-form/fields/percent-input';
import { ShareRowStyle } from '../styles';

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
  <ShareRowStyle data-testid={dataTestId}>
    <Input readOnly label={label} value={value} description={description} />
    <Input readOnly label="Share, %" value={formatPercentInput(share)} />
  </ShareRowStyle>
);
