import { ROLES } from 'consts/roles';
import { LoadingRecord, NodeOperatorId } from 'types';

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
};
