import { countCalendarDaysLeft, formatDate } from 'utils/format-date';

type Frame = { lastReport: number; nextReport: number };

export const getDistributionLabel = (nextReport: number) => {
  const days = countCalendarDaysLeft(nextReport);

  if (days <= 0) return 'Next distribution soon';
  if (days === 1) return 'Next distribution in 1 day';
  return `Next distribution in ${days} days`;
};

export const getFrameRange = ({ lastReport, nextReport }: Frame) =>
  lastReport
    ? `${formatDate(lastReport)} — ${formatDate(nextReport)}`
    : undefined;
