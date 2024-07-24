import { ROLES } from 'consts/roles';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorInfo } from 'shared/hooks';
import { type ChangeRoleFormNetworkData } from './types';

export const useChangeRoleFormNetworkData = ({
  role,
}: {
  role: ROLES;
}): [ChangeRoleFormNetworkData, () => Promise<void>] => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo()]);
  }, [updateInfo]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
    }),
    [isInfoLoading],
  );

  const currentAddress =
    role === ROLES.REWARDS ? info?.rewardAddress : info?.managerAddress;
  const proposedAddress =
    role === ROLES.REWARDS
      ? info?.proposedRewardAddress
      : info?.proposedManagerAddress;

  return [
    {
      role,
      currentAddress,
      proposedAddress,
      nodeOperatorId,
      loading,
    },
    revalidate,
  ];
};
