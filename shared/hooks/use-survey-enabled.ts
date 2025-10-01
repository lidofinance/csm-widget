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
  subSeconds,
  subWeeks,
} from 'date-fns';
import { useNodeOperatorId } from 'modules/web3';
import { useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';
import { useSurveysFilled } from './use-surveys-filled';

export const useSurveyEnabled = (skipClosed = false) => {
  const { start, isActive } = getSurveyDates();

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

const SURVEY_COUNT_WEEKS = 3;
const SURVEY_START_DAY_OF_WEEK = 4;

export const getSurveyDates = (currentDate: Date = new Date()) => {
  const today = new Date();

  const _corner = startOfQuarter(currentDate);
  const corner =
    Math.abs(differenceInMonths(_corner, currentDate)) > 1
      ? addQuarters(_corner, 1)
      : _corner;

  const start = subWeeks(
    startOfWeek(corner, { weekStartsOn: SURVEY_START_DAY_OF_WEEK }),
    SURVEY_COUNT_WEEKS / 2,
  );
  const end = subSeconds(addWeeks(start, SURVEY_COUNT_WEEKS), 1);

  const isActive = isAfter(today, start) && isBefore(today, end);

  return {
    start,
    end,
    isActive,
  };
};
