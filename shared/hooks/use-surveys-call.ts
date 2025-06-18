import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { isAfter, isBefore, parseISO } from 'date-fns';

const { defaultChain } = getConfig();

export const useSurveysCall = () => {
  const startOfSurvey = parseISO('2025-06-23T00:00Z');
  const endOfSurvey = parseISO('2025-07-06T00:00Z');
  const today = new Date();
  return (
    defaultChain === CHAINS.Mainnet &&
    isAfter(today, startOfSurvey) &&
    isBefore(today, endOfSurvey)
  );
};
