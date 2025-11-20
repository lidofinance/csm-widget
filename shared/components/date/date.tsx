import { FC } from 'react';
import { formatDate } from 'utils';
import { DateStyle } from './styles';

type Props = {
  timestamp: number | Date | undefined;
  format?: string;
};

export const Date: FC<Props> = ({ timestamp, format }) => {
  return <DateStyle>{formatDate(timestamp, format)}</DateStyle>;
};
