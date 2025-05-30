import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { useStethAmount } from './use-steth-amount';

export const useBondWillReceive = (
  token: TOKENS,
  amount?: bigint,
  rewards?: bigint,
) => {
  const stethAmount = useStethAmount(token, amount);

  return [
    (amount &&
      stethAmount &&
      rewards &&
      rewards > stethAmount &&
      rewards - stethAmount) ||
      0n,
    !!(amount && stethAmount && rewards && stethAmount > rewards),
  ] as const;
};
