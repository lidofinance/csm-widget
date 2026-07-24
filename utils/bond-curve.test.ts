import { bondForKeys, maxKeysForBond } from './bond-curve';

// Curves use small integers; the functions are unit-agnostic integer math.
// value = per-key trend, minKeyNumber is 1-based (interval i covers keys [m_i, m_{i+1}-1]).
const LINEAR = [{ minKeyNumber: 1, value: 10n }];
const TWO_TIER = [
  { minKeyNumber: 1, value: 24n }, // keys 1-2 cost 24 each
  { minKeyNumber: 3, value: 13n }, // keys 3+ cost 13 each
];
const THREE_TIER = [
  { minKeyNumber: 1, value: 24n }, // keys 1-2
  { minKeyNumber: 3, value: 13n }, // keys 3-5
  { minKeyNumber: 6, value: 5n }, //  keys 6+
];

describe('bondForKeys', () => {
  it('returns 0 for zero or negative counts', () => {
    expect(bondForKeys(TWO_TIER, 0)).toBe(0n);
    expect(bondForKeys(TWO_TIER, -1)).toBe(0n);
  });

  it('returns 0 for empty intervals', () => {
    expect(bondForKeys([], 5)).toBe(0n);
  });

  it('sums a single linear interval', () => {
    expect(bondForKeys(LINEAR, 1)).toBe(10n);
    expect(bondForKeys(LINEAR, 5)).toBe(50n);
  });

  it('sums across interval boundaries using 1-based minKeyNumber', () => {
    expect(bondForKeys(TWO_TIER, 1)).toBe(24n);
    expect(bondForKeys(TWO_TIER, 2)).toBe(48n);
    expect(bondForKeys(TWO_TIER, 3)).toBe(61n); // 48 + 13, NOT 72 (the old off-by-one)
    expect(bondForKeys(TWO_TIER, 4)).toBe(74n);
  });

  it('handles three tiers', () => {
    expect(bondForKeys(THREE_TIER, 5)).toBe(87n); // 2*24 + 3*13
    expect(bondForKeys(THREE_TIER, 6)).toBe(92n); // + 5
    expect(bondForKeys(THREE_TIER, 8)).toBe(102n); // + 2*5
  });
});

describe('maxKeysForBond', () => {
  it('returns 0 when amount cannot fund a single key', () => {
    expect(maxKeysForBond(TWO_TIER, 0n)).toBe(0);
    expect(maxKeysForBond(TWO_TIER, 23n)).toBe(0);
  });

  it('returns 0 for empty intervals', () => {
    expect(maxKeysForBond([], 1000n)).toBe(0);
  });

  it('floors within a single linear interval', () => {
    expect(maxKeysForBond(LINEAR, 50n)).toBe(5);
    expect(maxKeysForBond(LINEAR, 55n)).toBe(5);
    expect(maxKeysForBond(LINEAR, 9n)).toBe(0);
  });

  it('crosses interval boundaries and floors the remainder', () => {
    expect(maxKeysForBond(TWO_TIER, 24n)).toBe(1);
    expect(maxKeysForBond(TWO_TIER, 47n)).toBe(1);
    expect(maxKeysForBond(TWO_TIER, 48n)).toBe(2);
    expect(maxKeysForBond(TWO_TIER, 60n)).toBe(2);
    expect(maxKeysForBond(TWO_TIER, 61n)).toBe(3);
    expect(maxKeysForBond(TWO_TIER, 73n)).toBe(3);
    expect(maxKeysForBond(TWO_TIER, 74n)).toBe(4);
  });

  it('handles three tiers', () => {
    expect(maxKeysForBond(THREE_TIER, 87n)).toBe(5);
    expect(maxKeysForBond(THREE_TIER, 91n)).toBe(5);
    expect(maxKeysForBond(THREE_TIER, 92n)).toBe(6);
  });
});

describe('round-trip', () => {
  it('maxKeysForBond(bondForKeys(n)) === n', () => {
    for (const curve of [LINEAR, TWO_TIER, THREE_TIER]) {
      for (let n = 0; n <= 10; n++) {
        expect(maxKeysForBond(curve, bondForKeys(curve, n))).toBe(n);
      }
    }
  });
});
