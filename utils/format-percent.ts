export const formatPercent = (value?: number) =>
  Math.round((value ?? 0) * 1000) / 10;
