import { Tooltip } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { formatDate } from 'utils';
import { DateStyle } from './styles';

type Props = {
  timestamp: number | Date | undefined;
  format?: string;
};

export const Date: FC<Props> = ({ timestamp, format }) => {
  if (!timestamp) {
    return null;
  }
  return (
    <Tooltip title={formatDate(timestamp, 'PP')} placement="top">
      <DateStyle>{formatDate(timestamp, format)}</DateStyle>
    </Tooltip>
  );
};
