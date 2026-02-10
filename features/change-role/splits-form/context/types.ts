import { FeeSplit, NodeOperatorId, Rewards } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type SplitsFormInputType = {
  feeSplits: Partial<FeeSplit>[];
};

export type SplitsFormNetworkData = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  rewardsAddress: Address;
  currentFeeSplits: FeeSplit[];
  hasPendingShares: boolean;
  rewards: Rewards;
  isOwner: boolean;
};
