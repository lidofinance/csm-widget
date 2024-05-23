import { BigNumber } from 'ethers';
import { NodeOperatorId } from 'types';

export type ResetRoleFormDataContextValue = ResetRoleFormNetworkData;

export type ResetRoleFormInputType = {
  address?: string;
};

export type ResetRoleFormLoading = {
  isInfoLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type ResetRoleFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: ResetRoleFormLoading;
  revalidate: () => Promise<void>;
};

export type ResetRoleFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
