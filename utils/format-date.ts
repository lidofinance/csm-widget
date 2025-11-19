import {
  differenceInCalendarDays,
  differenceInDays,
  format,
  fromUnixTime,
} from 'date-fns';

export const formatDate = (timestamp?: number | Date, template = 'MMM dd') =>
  timestamp ? format(toDate(timestamp), template) : null;

export const countCalendarDaysLeft = (timestamp?: number | Date) =>
  timestamp ? differenceInCalendarDays(toDate(timestamp), new Date()) : null;

export const countDaysLeft = (timestamp?: number | Date) =>
  timestamp ? differenceInDays(toDate(timestamp), new Date()) : null;

const toDate = (timestamp: number | Date) =>
  typeof timestamp === 'number' ? fromUnixTime(timestamp) : timestamp;
