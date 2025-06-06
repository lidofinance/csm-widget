import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { useExchangeRate } from './use-exchange-rate';

export const useStethAmount = (token: TOKENS, amount: bigint) => {
  return useExchangeRate((amounts) => amounts[token] * amount);
};
