import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useMaxGasPrice, useNodeOperatorInfo } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { type ResetRoleFormNetworkData } from './types';

export const useResetRoleFormNetworkData = (): ResetRoleFormNetworkData => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo()]);
  }, [updateInfo]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    }),
    [isInfoLoading, isMultisigLoading, isMaxGasPriceLoading],
  );

  return {
    currentAddress: info?.managerAddress,
    nodeOperatorId,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    maxGasPrice,
    loading,
    revalidate,
  };
};
