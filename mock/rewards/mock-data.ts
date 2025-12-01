import { OperatorRewardsHistory } from '@lidofinance/lido-csm-sdk';

export type MockScenarioData = {
  nodeOperatorId: number;
  rewardsHistory: OperatorRewardsHistory;
};

export const createMockRewardsHistory = (
  data: OperatorRewardsHistory,
): OperatorRewardsHistory => {
  return data;
};
