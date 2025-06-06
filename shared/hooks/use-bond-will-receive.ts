import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { useStethAmount } from './use-steth-amount';

export const useBondWillReceive = (
  token: TOKENS,
  amount?: bigint,
  rewards?: bigint,
) => {
  // FIXME: exchange tokens rate
  const { data: stethAmount } = useStethAmount(token, amount ?? 0n);

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
