import { NodeOperatorId, ROLES } from '@lidofinance/lido-csm-sdk/common';
import { LoadingRecord } from 'types';
import { Address } from 'viem';

export type ChangeRoleFormInputType = {
  address?: Address;
  isRevoke: boolean;
};

export type ChangeRoleFormNetworkData = {
  address: Address;
  role: ROLES;
  nodeOperatorId?: NodeOperatorId;
  currentAddress?: Address;
  proposedAddress?: Address;
  isManagerReset: boolean;
  isRewardsChange: boolean;
  isPropose: boolean;
  loading: LoadingRecord<'info'>;
};
