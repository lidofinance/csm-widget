import { BASIS_POINTS_DENOMINATOR } from '@lidofinance/lido-ethereum-sdk';

export const getPercent = (part: bigint, total: bigint) =>
  total > 0n ? Number((part * BASIS_POINTS_DENOMINATOR) / total) / 100 : 0;
