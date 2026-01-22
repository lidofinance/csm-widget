export type WrappedStats = {
  hash: string;
  totalRewardsETH: bigint;
  topPerformancePercentile: number; // 0..100
  avgPerformance: bigint; // percent
  bestMonthPerformance: bigint; // percent
  bestMonth: string; // month name
  strikesCount: number;
  uploadedKeysCount: number;
  queueDays: number;
  activeDays: number;
  proposedBlocksCount: number;
  hasICS: boolean;
  hasLEA: boolean;
};

export type WrappedStatsRaw = Omit<
  WrappedStats,
  'totalRewardsETH' | 'avgPerformance' | 'bestMonthPerformance'
> & {
  totalRewardsETH: string;
  avgPerformance: number;
  bestMonthPerformance: number;
};

export type WrappedStatsResponse = WrappedStatsRaw | null;
