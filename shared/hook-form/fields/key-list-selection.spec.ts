import {
  isInKeyRange,
  KeyRangeSelection,
  toggleKeyIndex,
  toggleKeyRange,
  trimPubkey,
} from './key-list-selection';

describe('toggleKeyRange', () => {
  it.each<[KeyRangeSelection, number, KeyRangeSelection]>([
    [{ start: 0, count: 0 }, 2, { start: 2, count: 1 }],
    [{ start: 2, count: 2 }, 0, { start: 0, count: 4 }],
    [{ start: 1, count: 3 }, 2, { start: 1, count: 2 }],
    [{ start: 1, count: 3 }, 3, { start: 1, count: 2 }],
    [{ start: 1, count: 1 }, 1, { start: 1, count: 0 }],
    [{ start: 1, count: 2 }, 5, { start: 1, count: 5 }],
  ])('%p, click %p -> %p', (selection, position, expected) => {
    expect(toggleKeyRange(selection, position)).toEqual(expected);
  });
});

describe('isInKeyRange', () => {
  it('covers start to start + count - 1', () => {
    const range = { start: 1, count: 2 };
    expect([0, 1, 2, 3].map((i) => isInKeyRange(range, i))).toEqual([
      false,
      true,
      true,
      false,
    ]);
  });
});

describe('toggleKeyIndex', () => {
  it('adds a missing index at the end', () => {
    expect(toggleKeyIndex([4, 1], 7)).toEqual([4, 1, 7]);
  });

  it('removes a present index and keeps the order', () => {
    expect(toggleKeyIndex([4, 1, 7], 1)).toEqual([4, 7]);
  });
});

describe('trimPubkey', () => {
  const pubkey = `0x${'917c8a63d7ae7a69'.repeat(5)}bf1bad3c378e82ab`;

  it('keeps the first and last symbols, counting the 0x prefix', () => {
    expect(trimPubkey(pubkey, 16)).toBe('0x917c8a63d7ae7a...bf1bad3c378e82ab');
    expect(trimPubkey(pubkey, 6)).toBe('0x917c...8e82ab');
  });
});
