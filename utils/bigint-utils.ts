export const bigMax = (a: bigint, b: bigint) => (a > b ? a : b);

export const bigMin = (a: bigint, b: bigint) => (a < b ? a : b);

export const pow10n = (decimals: number) => 10n ** BigInt(decimals);
