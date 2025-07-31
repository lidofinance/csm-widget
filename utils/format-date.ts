import { differenceInCalendarDays, format, fromUnixTime } from 'date-fns';

export const formatDate = (timestamp?: number, template = 'MMM dd') =>
  timestamp ? format(fromUnixTime(timestamp), template) : null;

export const countDaysLeft = (timestamp?: number) =>
  timestamp
    ? differenceInCalendarDays(fromUnixTime(timestamp), new Date())
    : null;
