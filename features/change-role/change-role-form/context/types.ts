import { NodeOperatorId, ROLES } from '@lidofinance/lido-csm-sdk';
import { type ChangeRoleMode } from 'shared/hooks';
import { Address } from 'viem';

export type { ChangeRoleMode };

export type ChangeRoleFormInputType = {
  address?: Address;
  isRevoke: boolean;
};

export type ChangeRoleFormNetworkData = {
  address: Address;
  role: ROLES;
  nodeOperatorId: NodeOperatorId;
  extendedManagerPermissions: boolean;
  currentAddress: Address;
  proposedAddress: Address;
  mode: ChangeRoleMode;
};
