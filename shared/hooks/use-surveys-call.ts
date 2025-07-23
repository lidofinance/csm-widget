import { isBefore, parseISO } from 'date-fns';

import { isAfter } from 'date-fns';
import { useCallback } from 'react';

// TODO: update from main branch
export const useSurveysCall = () => {
  const startOfSurvey = parseISO('2025-06-23T00:00Z');
  const endOfSurvey = parseISO('2025-07-06T00:00Z');
  const today = new Date();
  const enabled = isAfter(today, startOfSurvey) && isBefore(today, endOfSurvey);

  const onClose = useCallback(() => {
    //nope;
  }, []);

  return {
    enabled,
    closed: true,
    onClose,
  };
};
