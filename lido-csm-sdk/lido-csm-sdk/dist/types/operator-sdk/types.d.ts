import { Address } from 'viem';
export type NodeOperatorInfo = {
  totalAddedKeys: number;
  totalWithdrawnKeys: number;
  totalDepositedKeys: number;
  totalVettedKeys: number;
  stuckValidatorsCount: number;
  depositableValidatorsCount: number;
  targetLimit: number;
  targetLimitMode: number;
  totalExitedKeys: number;
  enqueuedCount: number;
  usedPriorityQueue: boolean;
  managerAddress: Address;
  rewardsAddress: Address;
  extendedManagerPermissions: boolean;
  proposedManagerAddress?: Address;
  proposedRewardsAddress?: Address;
};
//# sourceMappingURL=types.d.ts.map
