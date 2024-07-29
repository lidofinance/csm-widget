import { ROLES } from 'consts/roles';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useAccount, useNodeOperatorInfo } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { compareLowercase } from 'utils';
import { type ChangeRoleFormNetworkData } from './types';

export const useChangeRoleFormNetworkData = ({
  role,
}: {
  role: ROLES;
}): [ChangeRoleFormNetworkData, () => Promise<void>] => {
  const { address } = useAccount();
  invariant(address);

  const nodeOperatorId = useNodeOperatorId();
  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);

  // TODO: force udpate info
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

  const isManagerReset =
    role === ROLES.MANAGER &&
    !info?.extendedManagerPermissions &&
    compareLowercase(info?.rewardAddress, address) &&
    !compareLowercase(info?.managerAddress, address);

  const isRewardsChange =
    role === ROLES.REWARDS &&
    !!info?.extendedManagerPermissions &&
    compareLowercase(info.managerAddress, address);

  const isPropose =
    !isManagerReset &&
    !isRewardsChange &&
    compareLowercase(currentAddress, address);

  return [
    {
      address,
      role,
      currentAddress,
      proposedAddress,
      nodeOperatorId,
      isManagerReset,
      isRewardsChange,
      isPropose,
      loading,
    },
    revalidate,
  ];
};
