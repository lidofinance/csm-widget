import {
  BondBalance,
  NodeOperatorId,
  Rewards,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { MaxValues } from './use-max-values';

export const CLAIM_OPTION = {
  /** Claim both Excess Bond and Rewards → Rewards Address */
  ALL_TO_RA: 'all-to-ra',
  /** Claim only Excess Bond → Rewards Address */
  BOND_TO_RA: 'bond-to-ra',
  /** Move all rewards to the bond */
  REWARDS_TO_BOND: 'rewards-to-bond',
  /** Claim Rewards → Rewards Address (no excess / insufficient with rewards > debt) */
  REWARDS_TO_RA: 'rewards-to-ra',
  /** Compensate Insufficient Bond from rewards (rewards ≤ debt) */
  COMPENSATE: 'compensate',
} as const;

export type ClaimOption = (typeof CLAIM_OPTION)[keyof typeof CLAIM_OPTION];

export type ClaimBondFormInputType = {
  token: TOKENS;
  amount?: bigint;
  claimOption: ClaimOption;
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
