import { pow10n } from './bigint-utils';

describe('pow10n', () => {
  it('returns 1n for zero decimals', () => {
    expect(pow10n(0)).toBe(1n);
  });

  it('stays exact beyond Number.MAX_SAFE_INTEGER', () => {
    expect(pow10n(30)).toBe(BigInt(`1${'0'.repeat(30)}`));
  });

  it('scales an aggregator answer down with bigint truncation', () => {
    expect(345_678_901_234n / pow10n(8)).toBe(3456n);
  });
});
