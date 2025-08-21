import { ROLES } from '@lidofinance/lido-csm-sdk';
import {
  KEY_OPERATOR_IS_OWNER,
  useDappStatus,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { compareLowercase } from 'utils';
import { type ChangeRoleFormNetworkData } from './types';
import { useInvalidate } from 'shared/hooks';

export const useChangeRoleFormNetworkData = ({
  role,
}: {
  role: ROLES;
}): [ChangeRoleFormNetworkData, () => Promise<void>] => {
  const { address } = useDappStatus();
  invariant(address);

  const nodeOperatorId = useNodeOperatorId();
  const {
    data: info,
    isPending: isInfoLoading,
    refetch: updateInfo,
  } = useOperatorInfo(nodeOperatorId);

  const invalidate = useInvalidate();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateInfo(),
      invalidate([KEY_OPERATOR_IS_OWNER]),
    ]);
  }, [invalidate, updateInfo]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
    }),
    [isInfoLoading],
  );

  const currentAddress =
    role === ROLES.REWARDS ? info?.rewardsAddress : info?.managerAddress;
  const proposedAddress =
    role === ROLES.REWARDS
      ? info?.proposedRewardsAddress
      : info?.proposedManagerAddress;

  const isManagerReset =
    role === ROLES.MANAGER &&
    !info?.extendedManagerPermissions &&
    compareLowercase(info?.rewardsAddress, address) &&
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
