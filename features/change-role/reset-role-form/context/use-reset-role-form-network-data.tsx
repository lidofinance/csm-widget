import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorInfo } from 'shared/hooks';
import { type ResetRoleFormNetworkData } from './types';

export const useResetRoleFormNetworkData = (): [
  ResetRoleFormNetworkData,
  () => Promise<void>,
] => {
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

  const currentAddress = info?.managerAddress;
  const proposedAddress = info?.proposedManagerAddress;

  return [
    {
      currentAddress,
      proposedAddress,
      nodeOperatorId,
      loading,
    },
    revalidate,
  ];
};
