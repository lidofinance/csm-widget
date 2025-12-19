import {
  differenceInCalendarDays,
  differenceInDays,
  format,
  formatDistanceToNow,
  fromUnixTime,
  parseISO,
} from 'date-fns';

export const formatDate = (timestamp?: number | Date, template = 'MMM dd') =>
  timestamp ? format(toDate(timestamp), template) : null;

export const countCalendarDaysLeft = (timestamp?: number | Date) =>
  timestamp ? differenceInCalendarDays(toDate(timestamp), new Date()) : null;

export const countDaysLeft = (timestamp?: number | Date) =>
  timestamp ? differenceInDays(toDate(timestamp), new Date()) : null;

export const formatDaysAgo = (timestamp: string | number | Date) =>
  formatDistanceToNow(toDate(timestamp), { addSuffix: true });

const toDate = (timestamp: number | string | Date) =>
  typeof timestamp === 'number'
    ? fromUnixTime(timestamp)
    : typeof timestamp === 'string'
      ? parseISO(timestamp)
      : timestamp;
