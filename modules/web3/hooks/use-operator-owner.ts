import { NodeOperatorId, ROLES } from '@lidofinance/lido-csm-sdk';
import { useOperatorInfo } from './use-operator-info';

export type NodeOperatorOwner = {
  role: ROLES;
  address: string;
};

export const useOperatorOwner = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  return useOperatorInfo(nodeOperatorId, (info) => {
    const isManagerOwner = info.extendedManagerPermissions;
    return {
      role: isManagerOwner ? ROLES.MANAGER : ROLES.REWARDS,
      address: isManagerOwner ? info.managerAddress : info.rewardsAddress,
    };
  });
};
