import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import type { Hex } from 'viem';
import {
  getBondAfterRemoval,
  getBondAfterRow,
  getRemovalFeeTotal,
  getRemoveKeyTags,
  getRemoveKeysArgs,
  showSequentialHint,
} from './remove-keys-state';

describe('getRemoveKeyTags', () => {
  it('keeps only the statuses that explain why a key is removable', () => {
    expect(
      getRemoveKeyTags({
        statuses: [
          KEY_STATUS.DEPOSITABLE,
          KEY_STATUS.DUPLICATED,
          KEY_STATUS.NON_QUEUED,
        ],
      }),
    ).toEqual([KEY_STATUS.DUPLICATED, KEY_STATUS.NON_QUEUED]);
  });

  it('returns no tags for a plain depositable key', () => {
    expect(getRemoveKeyTags({ statuses: [KEY_STATUS.DEPOSITABLE] })).toEqual(
      [],
    );
  });

  it('keeps unbonded, invalid and unchecked', () => {
    expect(
      getRemoveKeyTags({
        statuses: [
          KEY_STATUS.UNBONDED,
          KEY_STATUS.INVALID,
          KEY_STATUS.UNCHECKED,
        ],
      }),
    ).toEqual([KEY_STATUS.UNBONDED, KEY_STATUS.INVALID, KEY_STATUS.UNCHECKED]);
  });
});

describe('showSequentialHint', () => {
  it('shows the hint only for more than two keys', () => {
    expect(showSequentialHint(2)).toBe(false);
    expect(showSequentialHint(3)).toBe(true);
  });
});

describe('getRemovalFeeTotal', () => {
  it('is undefined without a fee', () => {
    expect(getRemovalFeeTotal(undefined, 2)).toBeUndefined();
    expect(getRemovalFeeTotal(0n, 2)).toBeUndefined();
  });

  it('multiplies the per-key fee by the selected count', () => {
    expect(getRemovalFeeTotal(20000000000000000n, 3)).toBe(60000000000000000n);
    expect(getRemovalFeeTotal(20000000000000000n, 0)).toBe(0n);
  });
});

describe('getRemoveKeysArgs', () => {
  const keys = ['0xa', '0xb', '0xc', '0xd'].map((pubkey) => ({
    pubkey: pubkey as Hex,
  }));

  it('offsets the start by the deposited keys and slices the pubkeys', () => {
    expect(getRemoveKeysArgs(keys, 5, { start: 1, count: 2 })).toEqual({
      startIndex: 6n,
      keysCount: 2n,
      pubkeys: ['0xb', '0xc'],
    });
  });

  it('handles a selection from the first key', () => {
    expect(getRemoveKeysArgs(keys, 0, { start: 0, count: 1 })).toEqual({
      startIndex: 0n,
      keysCount: 1n,
      pubkeys: ['0xa'],
    });
  });
});

describe('getBondAfterRemoval', () => {
  it('subtracts the removed keys and the total fee', () => {
    expect(
      getBondAfterRemoval({
        totalAddedKeys: 10,
        totalWithdrawnKeys: 2,
        bondCurrent: 1000n,
        removalFee: 10n,
        count: 3,
      }),
    ).toEqual({ nextKeysCount: 5, bondAfter: 970n });
  });
});

describe('getBondAfterRow', () => {
  it('reads as excess while the balance is unknown', () => {
    expect(getBondAfterRow()).toEqual({
      label: 'Excess bond after execution',
      insufficient: false,
      amount: undefined,
    });
  });

  it('reads as excess with a surplus', () => {
    expect(getBondAfterRow({ delta: 5n, isInsufficient: false })).toEqual({
      label: 'Excess bond after execution',
      insufficient: false,
      amount: 5n,
    });
  });

  it('reads as insufficient with a shortfall', () => {
    expect(getBondAfterRow({ delta: 7n, isInsufficient: true })).toEqual({
      label: 'Insufficient bond after execution',
      insufficient: true,
      amount: 7n,
    });
  });
});
