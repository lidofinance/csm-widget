import { Tooltip } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatDate } from 'utils';
import s from './date.module.css';

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
      <span className={s.root}>{formatDate(timestamp, format)}</span>
    </Tooltip>
  );
};
