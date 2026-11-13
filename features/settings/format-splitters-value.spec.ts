import { formatSplittersValue } from './format-splitters-value';

const split = (share: number) => ({
  recipient: '0x0000000000000000000000000000000000000001' as const,
  share: BigInt(share),
});

describe('formatSplittersValue', () => {
  it('is undefined without splits', () => {
    expect(formatSplittersValue(undefined, true)).toBeUndefined();
    expect(formatSplittersValue([], true)).toBeUndefined();
  });

  it('shows the equal share for the CSM family', () => {
    expect(
      formatSplittersValue(
        Array.from({ length: 5 }, () => split(2000)),
        true,
      ),
    ).toBe('5 addresses, 20% each');
  });

  it('shows only the count for unequal shares', () => {
    expect(formatSplittersValue([split(2000), split(3000)], true)).toBe(
      '2 addresses',
    );
  });

  it('shows only the count for CM', () => {
    expect(
      formatSplittersValue(
        Array.from({ length: 5 }, () => split(2000)),
        false,
      ),
    ).toBe('5 addresses');
  });

  it('omits "each" for a single CSM-family address', () => {
    expect(formatSplittersValue([split(1000)], true)).toBe('1 address, 10%');
  });

  it('uses the singular for one address', () => {
    expect(formatSplittersValue([split(1000)], false)).toBe('1 address');
  });
});
