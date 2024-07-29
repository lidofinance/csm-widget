import { ROLES } from 'consts/roles';
import { LoadingRecord, NodeOperatorId } from 'types';

export type ChangeRoleFormInputType = {
  address?: string;
  isRevoke: boolean;
};

export type ChangeRoleFormNetworkData = {
  address: string;
  role: ROLES;
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: string;
  proposedAddress?: string;
  isManagerReset: boolean;
  isRewardsChange: boolean;
  isPropose: boolean;
  loading: LoadingRecord<'info'>;
};
