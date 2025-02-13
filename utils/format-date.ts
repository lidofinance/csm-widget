import { format, fromUnixTime } from 'date-fns';

export const formatDate = (timestamp?: number) =>
  timestamp ? format(fromUnixTime(timestamp), 'MMM dd') : null;
