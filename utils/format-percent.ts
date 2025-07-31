import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';

export const formatPercent = (value?: number | bigint) => {
  const _value =
    typeof value === 'bigint'
      ? Number(value) / Number(PERCENT_BASIS)
      : (value ?? 0);

  return `${Math.round(_value * 1000) / 10}%`;
};
