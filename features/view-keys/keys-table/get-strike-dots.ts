import type { KeyStrikes } from '@lidofinance/lido-csm-sdk';
import { getArraySum } from 'utils/get-array-sum';

export const STRIKE_DOT_SIZE = 16;
export const STRIKE_DOT_GAP = 4;

export const getStrikeDotsWidth = (threshold: number) =>
  threshold * STRIKE_DOT_SIZE + Math.max(threshold - 1, 0) * STRIKE_DOT_GAP;

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
