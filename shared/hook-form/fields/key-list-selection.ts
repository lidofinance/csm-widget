import { trimAddress } from '@lidofinance/address';

export type KeyListFieldMode = 'range' | 'multi';

export type KeyRangeSelection = { start: number; count: number };

export const EMPTY_KEY_RANGE: KeyRangeSelection = { start: 0, count: 0 };

export const isInKeyRange = (
  { start, count }: KeyRangeSelection,
  position: number,
): boolean => position >= start && position < start + count;

/** Contiguous range toggle: a click before the range extends it, inside truncates it, on its last key shrinks it. */
export const toggleKeyRange = (
  { start, count }: KeyRangeSelection,
  position: number,
): KeyRangeSelection => {
  if (count === 0) return { start: position, count: 1 };
  if (position < start) {
    return { start: position, count: start + count - position };
  }
  if (position === start + count - 1) return { start, count: count - 1 };
  return { start, count: position - start + 1 };
};

export const toggleKeyIndex = (selection: number[], index: number): number[] =>
  selection.includes(index)
    ? selection.filter((item) => item !== index)
    : [...selection, index];

// Same trimming as the e2e locator: `trimAddress('0x' + key, 16)`
export const trimPubkey = (pubkey: string, symbols: number): string =>
  trimAddress(pubkey, symbols);
