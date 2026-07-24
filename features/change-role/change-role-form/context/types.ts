import {
  NodeOperatorId,
  NodeOperatorInviteInfo,
  ROLES,
} from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ChangeRoleIntent = 'submit' | 'revoke' | 'accept';

export type ChangeRoleFormInputType = {
  address?: Address;
  intent: ChangeRoleIntent;
};

export type ChangeRoleFormNetworkData = {
  address: Address;
  role: ROLES;
  nodeOperatorId: NodeOperatorId;
  extendedManagerPermissions: boolean;
  currentAddress: Address;
  proposedAddress: Address;
  canEdit: boolean;
  invite: Pick<NodeOperatorInviteInfo, 'nodeOperatorId' | 'role'> | null;
};
