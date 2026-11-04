import { Input } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatPercentInput } from 'shared/hook-form/fields/percent-input';
import { ShareRowStyle } from '../styles';

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
  <ShareRowStyle data-testid={dataTestId}>
    <Input readOnly label={label} value={value} />
    <Input readOnly label="Share, %" value={formatPercentInput(share)} />
  </ShareRowStyle>
);
