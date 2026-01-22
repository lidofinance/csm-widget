import { WrappedStatsRaw } from 'features/wrapped/data/types';

export type MockWrappedScenarioData = {
  nodeOperatorId: number;
  stats: WrappedStatsRaw;
};

export const createMockWrappedStats = (
  data: WrappedStatsRaw,
): WrappedStatsRaw => {
  return data;
};
