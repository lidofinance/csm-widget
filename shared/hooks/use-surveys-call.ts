import { isBefore, parseISO } from 'date-fns';

export const useSurveysCall = () => {
  const endOfSurvey = parseISO('2025-04-01T00:00Z');
  const today = new Date();
  return isBefore(today, endOfSurvey);
};
