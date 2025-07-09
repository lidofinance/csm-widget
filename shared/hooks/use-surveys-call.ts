import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getConfig } from 'config';
import { isBefore, parseISO } from 'date-fns';

const { defaultChain } = getConfig();

export const useSurveysCall = () => {
  const endOfSurvey = parseISO('2025-04-01T00:00Z');
  const today = new Date();
  return defaultChain === CHAINS.Mainnet && isBefore(today, endOfSurvey);
};
