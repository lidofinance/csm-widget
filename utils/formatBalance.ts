import { useMemo } from 'react';
import { formatEther } from 'viem';

export type FormatBalanceArgs = {
  maxDecimalDigits?: number;
  adaptiveDecimals?: boolean;
  maxTotalLength?: number;
};

export const formatBalance = (
  balance = 0n,
  {
    maxDecimalDigits = 4,
    maxTotalLength,
    adaptiveDecimals,
  }: FormatBalanceArgs = {},
) => {
  const actual = formatEther(balance);
  let trimmed = actual;
  let isTrimmed = false;

  const [integer, decimal = '0'] = actual.split('.');

  let trimmedDecimal = decimal.slice(0, maxDecimalDigits);
  if (adaptiveDecimals) {
    const nonZeroIdx = decimal.split('').findIndex((v) => v !== '0');
    const sliceAt = Math.max(maxDecimalDigits, nonZeroIdx + 1);
    trimmedDecimal = decimal.slice(0, sliceAt);
  }

  if (maxTotalLength && integer.length >= maxTotalLength - 1) {
    trimmed = integer;
    if (decimal.length > 0 && decimal !== '0') {
      isTrimmed = true;
    }
    if (trimmed.length > maxTotalLength) {
      isTrimmed = true;
      trimmed = trimmed.slice(0, maxTotalLength - 3) + '...';
    }
  } else {
    trimmed = trimmedDecimal ? `${integer}.${trimmedDecimal}` : integer;
    if (trimmedDecimal.length < decimal.length) {
      isTrimmed = true;
    }
    if (maxTotalLength && trimmed.length > maxTotalLength) {
      isTrimmed = true;
      trimmed = trimmed.slice(0, maxTotalLength);
    }
  }

  return {
    actual,
    trimmed,
    isTrimmed,
  };
};

export const useFormattedBalance: typeof formatBalance = (
  balance = 0n,
  { maxDecimalDigits = 4, maxTotalLength, adaptiveDecimals } = {},
) => {
  return useMemo(
    () =>
      formatBalance(balance, {
        maxDecimalDigits,
        maxTotalLength,
        adaptiveDecimals,
      }),
    [adaptiveDecimals, balance, maxDecimalDigits, maxTotalLength],
  );
};
