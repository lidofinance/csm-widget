import { LoadingRecord, NodeOperatorId } from 'types';

export type ResetRoleFormDataContextValue = ResetRoleFormNetworkData;

export type ResetRoleFormInputType = { address?: string };

export type ResetRoleFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  loading: LoadingRecord<'info'>;
  revalidate: () => Promise<void>;
};

export type ResetRoleFormValidationContext = {
  currentAddress?: string;
  proposedAddress?: string;
};
