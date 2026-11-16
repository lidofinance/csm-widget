export const bigMax = (a: bigint, b: bigint) => (a > b ? a : b);

export const bigMin = (a: bigint, b: bigint) => (a < b ? a : b);

export const pow10n = (decimals: number) => 10n ** BigInt(decimals);

export const compareBigint = (a: bigint, b: bigint) =>
  a < b ? -1 : a > b ? 1 : 0;
