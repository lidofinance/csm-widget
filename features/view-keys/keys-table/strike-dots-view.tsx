import { Tooltip } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { formatDate } from 'utils/format-date';
import type { StrikeDotsState } from './get-strike-dots';
import s from './strike-dots-view.module.css';

export const StrikeDotsView: FC<
  StrikeDotsState & { lastStrikeDate?: number }
> = ({ count, filled, threshold, lastStrikeDate }) => {
  const dots = (
    <span
      className={s.dots}
      role="img"
      aria-label={`${count}/${threshold} strikes`}
    >
      {Array.from({ length: threshold }, (_, i) => (
        <span key={i} className={s.dot} data-filled={i < filled} />
      ))}
    </span>
  );

  if (lastStrikeDate === undefined) return dots;

  return (
    <Tooltip
      content={`Last Strike: ${formatDate(lastStrikeDate, 'dd.MM.yyyy')}`}
    >
      {dots}
    </Tooltip>
  );
};
