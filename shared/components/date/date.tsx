import { Tooltip } from '@lidofinance/lido-app-ui';
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
    <Tooltip content={formatDate(timestamp, 'PP')} position="top">
      <DateStyle>{formatDate(timestamp, format)}</DateStyle>
    </Tooltip>
  );
};
