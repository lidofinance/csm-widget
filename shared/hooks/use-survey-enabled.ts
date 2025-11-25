import {
  addQuarters,
  addWeeks,
  differenceInMonths,
  isAfter,
  isBefore,
  startOfQuarter,
  startOfWeek,
  subSeconds,
  subWeeks,
} from 'date-fns';
import { useNodeOperatorId } from 'modules/web3';
import { useDismiss } from './use-dismiss';
import { useSurveysFilled } from './use-surveys-filled';
import { useShowFlags } from './use-show-rule';

export const useSurveyEnabled = (skipClosed = false) => {
  const { end, isActive } = getSurveyDates();
  const { IS_SURVEYS_ACTIVE } = useShowFlags();

  const nodeOperatorId = useNodeOperatorId();

  const { isDismissed: isClosed, dismiss: onClose } = useDismiss(
    `surveys-cta-closed-${nodeOperatorId}`,
    end,
  );

  const { data: filled } = useSurveysFilled(
    IS_SURVEYS_ACTIVE && isActive && (!isClosed || skipClosed)
      ? nodeOperatorId
      : undefined,
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
