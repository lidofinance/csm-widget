import { ROLES } from 'consts/roles';
import { LoadingRecord, NodeOperatorId } from 'types';

export type ChangeRoleFormDataContextValue = ChangeRoleFormNetworkData;

export type ChangeRoleFormInputType = {
  address?: string;
  isRevoke: boolean;
};

export type ChangeRoleFormNetworkData = {
  role: ROLES;
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  loading: LoadingRecord<'info'>;
  revalidate: () => Promise<void>;
};

export type ChangeRoleFormValidationContext = {
  currentAddress?: string;
  proposedAddress?: string;
};
