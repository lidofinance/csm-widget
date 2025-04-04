import { differenceInCalendarDays, format, fromUnixTime } from 'date-fns';

export const formatDate = (timestamp?: number) =>
  timestamp ? format(fromUnixTime(timestamp), 'MMM dd') : null;

export const countDaysLeft = (timestamp?: number) =>
  timestamp
    ? differenceInCalendarDays(fromUnixTime(timestamp), new Date())
    : null;
