import { NodeOperatorId, ROLES } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

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
  isManagerReset: boolean;
  isRewardsChange: boolean;
  isPropose: boolean;
};
