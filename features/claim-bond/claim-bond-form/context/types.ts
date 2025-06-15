import { LoadingRecord } from 'types';
import { MaxValues } from './use-max-values';
import {
  BondBalance,
  NodeOperatorId,
  Rewards,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';

export type ClaimBondFormInputType = {
  token: TOKENS;
  amount?: bigint;
  claimRewards: boolean;
  unlockClaimTokens: boolean;
};

export type ClaimBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  bond?: BondBalance;
  rewards?: Rewards;
  maxValues?: MaxValues;
  rewardsAddress?: string;
  isContract?: boolean;
  isSplitter?: boolean;
  isPaused?: boolean;
  loading: LoadingRecord<
    'bond' | 'rewards' | 'maxValues' | 'info' | 'contract' | 'status'
  >;
};
