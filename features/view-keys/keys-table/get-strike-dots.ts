import type { KeyStrikes } from '@lidofinance/lido-csm-sdk';
import { getArraySum } from 'utils/get-array-sum';

export type StrikeDotsState = {
  count: number;
  filled: number;
  threshold: number;
  lastStrikeIndex: number | undefined;
};

export const getStrikeDots = (
  strikes: Readonly<KeyStrikes> | undefined,
  threshold: number,
): StrikeDotsState => {
  const count = getArraySum(strikes);
  const last = strikes?.findIndex((value) => value > 0) ?? -1;
  return {
    count,
    threshold,
    filled: Math.min(count, threshold),
    lastStrikeIndex: last >= 0 ? last : undefined,
  };
};
