import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';
import { NodeOperatorId } from 'types';

export type ClaimBondFormDataContextValue = ClaimBondFormNetworkData;

export type ClaimBondFormInputType = {
  token: TOKENS;
  amount: BigNumber | null;
};

export type ClaimBondFormLoading = {
  isBondBalanceLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type ClaimBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  bondBalance?: BigNumber;
  bondRequired?: BigNumber;
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: ClaimBondFormLoading;
  revalidate: () => Promise<void>;
};

export type ClaimBondFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
