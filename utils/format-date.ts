/* eslint-disable func-style */
import {
  differenceInCalendarDays,
  differenceInDays,
  format,
  formatDistanceToNow,
  fromUnixTime,
  parseISO,
} from 'date-fns';

export function formatDate(timestamp: number | Date, template?: string): string;
export function formatDate(timestamp: undefined, template?: string): null;
export function formatDate(
  timestamp?: number | Date,
  template?: string,
): string | null;
export function formatDate(timestamp?: number | Date, template = 'MMM dd') {
  return timestamp ? format(toDate(timestamp), template) : null;
}

export function countCalendarDaysLeft(timestamp: number | Date): number;
export function countCalendarDaysLeft(timestamp: undefined): null;
export function countCalendarDaysLeft(timestamp?: number | Date): number | null;
export function countCalendarDaysLeft(timestamp?: number | Date) {
  return timestamp
    ? differenceInCalendarDays(toDate(timestamp), new Date())
    : null;
}

export function countDaysLeft(timestamp: number | Date): number;
export function countDaysLeft(timestamp: undefined): null;
export function countDaysLeft(timestamp?: number | Date): number | null;
export function countDaysLeft(timestamp?: number | Date) {
  return timestamp ? differenceInDays(toDate(timestamp), new Date()) : null;
}

export const isDayInPast = (timestamp: number | Date) =>
  countDaysLeft(timestamp) < 0;

export const formatDaysAgo = (timestamp: string | number | Date) =>
  formatDistanceToNow(toDate(timestamp), { addSuffix: true });

const toDate = (timestamp: number | string | Date) =>
  typeof timestamp === 'number'
    ? fromUnixTime(timestamp)
    : typeof timestamp === 'string'
      ? parseISO(timestamp)
      : timestamp;
