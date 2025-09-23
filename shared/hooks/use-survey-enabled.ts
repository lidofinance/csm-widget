import {
  addQuarters,
  addWeeks,
  differenceInMonths,
  formatISO,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subWeeks,
} from 'date-fns';
import { useCallback } from 'react';
import { useSurveysFilled } from './use-surveys-filled';
import { useNodeOperatorId } from 'modules/web3';
import { useLocalStorage } from './use-local-storage';

export const useSurveyEnabled = (skipClosed = false) => {
  const today = new Date();
  const { start, end } = getSurveyDates();
  const isActive = isAfter(today, start) && isBefore(today, end);

  const nodeOperatorId = useNodeOperatorId();
  const [closedAt, setClosedAt] = useLocalStorage(
    `surveys-cta-closed-${nodeOperatorId}`,
    '',
  );
  const closedDate = parseISO(closedAt);
  const isClosed = isValid(closedDate) && isAfter(closedDate, start);

  const onClose = useCallback(() => {
    setClosedAt(formatISO(new Date(), { representation: 'date' }));
  }, [setClosedAt]);

  const { data: filled } = useSurveysFilled(
    isActive && (!isClosed || skipClosed) ? nodeOperatorId : undefined,
  );

  return {
    enabled: filled?.isFilled === false,
    onClose,
  };
};

export const getSurveyDates = (currentDate: Date = new Date()) => {
  startOfYear;
  const _corner = startOfQuarter(currentDate);
  const corner =
    differenceInMonths(_corner, currentDate) > 1
      ? addQuarters(_corner, 1)
      : _corner;

  const start = subWeeks(startOfWeek(corner, { weekStartsOn: 1 }), 1);
  const end = addWeeks(start, 2);

  return {
    start,
    end,
  };
};
