import {
  BondBalance,
  NodeOperatorId,
  Rewards,
  StethPoolData,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';

export const CLAIM_OPTION = {
  /** Claim available bond (excess) + rewards → Rewards Address. */
  ALL_TO_RA: 'all-to-ra',
  /** Claim only Excess Bond → Rewards Address. Requires excess bond > 0. */
  BOND_TO_RA: 'bond-to-ra',
  /** Move rewards to the bond. */
  REWARDS_TO_BOND: 'rewards-to-bond',
} as const;

export type CLAIM_OPTION = (typeof CLAIM_OPTION)[keyof typeof CLAIM_OPTION];

export type ClaimBondFormInputType = {
  token: TOKENS;
  amount?: bigint;
  claimOption: CLAIM_OPTION;
  unlockedClaimTokens: boolean;
};

// TODO: splitters
export type ClaimBondFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  bond: BondBalance;
  rewards: Rewards;
  poolData: StethPoolData;
  rewardsAddress: string;
  isContract: boolean;
  isPaused: boolean;
  availableOptions: CLAIM_OPTION[];
};
