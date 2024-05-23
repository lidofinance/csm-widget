import { ROLES } from 'consts/roles';
import { BigNumber } from 'ethers';
import { NodeOperatorId } from 'types';

export type ChangeRoleFormDataContextValue = ChangeRoleFormNetworkData;

export type ChangeRoleFormInputType = {
  address?: string;
  role: ROLES;
};

export type ChangeRoleFormLoading = {
  isInfoLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type ChangeRoleFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: ChangeRoleFormLoading;
  revalidate: () => Promise<void>;
};

export type ChangeRoleFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
