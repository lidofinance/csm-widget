import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';
import {
  BondBalance,
  LoadingRecord,
  NodeOperatorId,
  RewardsBalance,
} from 'types';

export type ClaimBondFormDataContextValue = ClaimBondFormNetworkData;

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
  loading: LoadingRecord<'bond' | 'rewards' | 'lockedBond'>;
  revalidate: () => Promise<void>;
};

export type ClaimBondFormValidationContext = {
  etherBalance: BigNumber;
};
