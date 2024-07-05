import { NodeOperatorId } from 'types';

export type ResetRoleFormDataContextValue = ResetRoleFormNetworkData;

export type ResetRoleFormInputType = { address?: string };

export type ResetRoleFormLoading = {
  isInfoLoading: boolean;
};

export type ResetRoleFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  loading: ResetRoleFormLoading;
  revalidate: () => Promise<void>;
};

export type ResetRoleFormValidationContext = {
  currentAddress?: string;
  proposedAddress?: string;
};
