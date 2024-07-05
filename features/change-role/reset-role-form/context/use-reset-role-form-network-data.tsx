import { AddressZero } from '@ethersproject/constants';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorInfo } from 'shared/hooks';
import { type ResetRoleFormNetworkData } from './types';

export const useResetRoleFormNetworkData = (): ResetRoleFormNetworkData => {
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
  const proposedAddressRaw = info?.proposedManagerAddress;
  const proposedAddress =
    proposedAddressRaw !== AddressZero ? proposedAddressRaw : undefined;

  return {
    currentAddress,
    proposedAddress,
    nodeOperatorId,
    loading,
    revalidate,
  };
};
