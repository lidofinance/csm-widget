import type { CurveParameters } from '@lidofinance/lido-csm-sdk';

export type ClaimTypeSummary = {
  bondFirstKey?: bigint;
  reward?: bigint;
  rewardKeys?: number;
  priorityKeys: number;
};

export const getClaimTypeSummary = (
  parameters?: CurveParameters,
): ClaimTypeSummary | undefined => {
  if (!parameters) return undefined;

  const { bondConfig, rewardsConfig, queueConfig } = parameters;
  const firstReward = rewardsConfig.at(0);
  const nextReward = rewardsConfig.at(1);

  return {
    bondFirstKey: bondConfig.at(0)?.value,
    reward: firstReward?.value,
    rewardKeys:
      firstReward && nextReward
        ? nextReward.minKeyNumber - firstReward.minKeyNumber
        : undefined,
    // Same rule as formatQueues: no priority slot means the general queue only
    priorityKeys:
      !queueConfig || queueConfig.priority >= queueConfig.lowestPriority
        ? 0
        : queueConfig.maxDeposits,
  };
};
