import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import {
  BondBalance,
  LoadingRecord,
  NodeOperatorId,
  RewardsBalance,
} from 'types';
import { MaxValues } from './use-max-values';

export type ClaimBondFormInputType = {
  token: TOKENS;
  amount?: BigNumber;
  claimRewards: boolean;
  unlockClaimTokens: boolean;
};

export type ClaimBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  bond?: BondBalance;
  rewards?: RewardsBalance;
  maxValues?: MaxValues;
  rewardsAddress?: string;
  isContract?: boolean;
  isSplitter?: boolean;
  isPaused?: boolean;
  loading: LoadingRecord<
    'bond' | 'rewards' | 'maxValues' | 'info' | 'contract' | 'status'
  >;
};
