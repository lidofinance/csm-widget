import { FeeSplit, NodeOperatorId, Rewards } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type SplitsFormInputType = {
  isEditing: boolean;
  feeSplits: Partial<FeeSplit>[];
  totalShare: bigint;
};

export type SplitsFormNetworkData = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  currentFeeSplits: FeeSplit[];
  rewards: Rewards;
  pendingSharesToSplit: bigint;
  isOwner: boolean;
  editRestricted: boolean;
};
