import { differenceInCalendarDays, format, fromUnixTime } from 'date-fns';

export const formatDate = (timestamp?: number | Date, template = 'MMM dd') =>
  timestamp
    ? format(
        typeof timestamp === 'number' ? fromUnixTime(timestamp) : timestamp,
        template,
      )
    : null;

export const countDaysLeft = (timestamp?: number) =>
  timestamp
    ? differenceInCalendarDays(fromUnixTime(timestamp), new Date())
    : null;
