import {
  BondBalance,
  NodeOperatorId,
  Rewards,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { MaxValues } from './use-max-values';

export type ClaimBondFormInputType = {
  token: TOKENS;
  amount?: bigint;
  claimRewards: boolean;
  unlockedClaimTokens: boolean;
};

export type ClaimBondFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  bond: BondBalance;
  rewards: Rewards;
  maxValues: MaxValues;
  rewardsAddress: string;
  isContract: boolean;
  isPaused: boolean;
};
