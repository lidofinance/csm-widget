import { calcGasCostWei, formatUsdCost, hashString } from './gas-cost';

describe('calcGasCostWei', () => {
  it('multiplies gas by price', () => {
    expect(calcGasCostWei(21000n, 2n * 10n ** 9n)).toBe(42000n * 10n ** 9n);
  });
});

describe('formatUsdCost', () => {
  it('formats with two decimals', () => {
    expect(formatUsdCost(0)).toBe('$0.00');
    expect(formatUsdCost(1.236)).toBe('$1.24');
    expect(formatUsdCost(1234.5)).toBe('$1,234.50');
  });

  it('marks tiny non-zero values', () => {
    expect(formatUsdCost(0.004)).toBe('<$0.01');
  });

  it('rejects invalid values', () => {
    expect(formatUsdCost(NaN)).toBeUndefined();
    expect(formatUsdCost(-1)).toBeUndefined();
  });
});

describe('hashString', () => {
  it('is stable and sensitive to input', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
  });
});
