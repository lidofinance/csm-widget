import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';
import { NodeOperatorId, Proof } from 'types';

export type ClaimRewardsFormDataContextValue = ClaimRewardsFormNetworkData;

export type ClaimRewardsFormInputType = {
  token: TOKENS;
  amount: BigNumber | null;
  reward?: {
    proof: Proof;
    shares: BigNumber;
  };
};

export type ClaimRewardsFormLoading = {
  isBondBalanceLoading: boolean;
  isRewardsLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type ClaimRewardsFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  bondBalance?: BigNumber;
  bondRequired?: BigNumber;
  availableRewards?: BigNumber;
  totalRewards?: BigNumber;
  proof?: Proof;
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: ClaimRewardsFormLoading;
  revalidate: () => Promise<void>;
};

export type ClaimRewardsFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
