import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';

export const formatPercent = (
  value?: number | bigint,
  percentSymbol = true,
  decimals?: number,
) => {
  const _value =
    100 *
    (typeof value === 'bigint'
      ? Number(value) / Number(PERCENT_BASIS)
      : (value ?? 0));

  if (decimals !== undefined) {
    return `${_value.toFixed(decimals)}${percentSymbol ? '%' : ''}`;
  }

  return `${Math.round(_value * 10) / 10}${percentSymbol ? '%' : ''}`;
};
