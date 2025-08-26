import { ROLES } from 'consts/roles';
import { useMemo } from 'react';
import { NodeOperatorId } from 'types';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';

type NodeOperatorOwner = {
  role: ROLES;
  address: string;
};

export const useNodeOperatorOwner = (
  nodeOperatorId?: NodeOperatorId,
): NodeOperatorOwner | undefined => {
  const { data: info } = useNodeOperatorInfo(nodeOperatorId);

  return useMemo<NodeOperatorOwner | undefined>(() => {
    if (!info) {
      return undefined;
    }

    // Based on CSModule.sol#L1141 logic:
    // If extendedManagerPermissions is true, manager is the owner
    // Otherwise, rewards address is the owner
    const isManagerOwner = info.extendedManagerPermissions;

    return {
      role: isManagerOwner ? ROLES.MANAGER : ROLES.REWARDS,
      address: isManagerOwner ? info.managerAddress : info.rewardAddress,
    };
  }, [info]);
};
