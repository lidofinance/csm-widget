import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useExchangeRate } from './use-exchange-rate';
import { convert } from 'utils';

export const useBondWillReceive = (
  token: TOKENS,
  amount?: bigint,
  rewards?: bigint,
) => {
  const { data: stethAmount } = useExchangeRate((rates) =>
    convert(amount ?? 0n, rates[token]),
  );

  return [
    (amount !== undefined &&
      stethAmount !== undefined &&
      rewards !== undefined &&
      rewards > stethAmount &&
      rewards - stethAmount) ||
      0n,
    !!(
      amount !== undefined &&
      stethAmount !== undefined &&
      rewards !== undefined &&
      stethAmount > rewards
    ),
  ] as const;
};
