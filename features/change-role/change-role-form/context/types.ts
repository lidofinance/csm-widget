import { ROLES } from 'consts/roles';
import { BigNumber } from 'ethers';
import { NodeOperatorId } from 'types';

export type ChangeRoleFormDataContextValue = ChangeRoleFormNetworkData;

export type ChangeRoleFormInputType = {
  address?: string;
  isRevoke: boolean;
};

export type ChangeRoleFormLoading = {
  isInfoLoading: boolean;
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type ChangeRoleFormNetworkData = {
  role: ROLES;
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: ChangeRoleFormLoading;
  revalidate: () => Promise<void>;
};

export type ChangeRoleFormValidationContext = {
  currentAddress?: string;
  proposedAddress?: string;
};
