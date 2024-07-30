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
};

export type ClaimBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  bond?: BondBalance;
  rewards?: RewardsBalance;
  lockedBond?: BigNumber;
  maxValues?: MaxValues;
  loading: LoadingRecord<'bond' | 'rewards' | 'lockedBond' | 'maxValues'>;
};
