import {
  differenceInCalendarDays,
  differenceInDays,
  fromUnixTime,
} from 'date-fns';

type Args = { nextReport: number; now: Date };

export const getNextDistributionLabel = ({ nextReport, now }: Args) => {
  const date = fromUnixTime(nextReport);
  if (differenceInDays(date, now) < 0) return 'Distribution is delayed';

  const days = Math.max(0, differenceInCalendarDays(date, now));
  if (days === 0) return 'Today';
  return `In ~${days} ${days === 1 ? 'day' : 'days'}`;
};
