import {
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type NormalizeQueueFormNetworkData } from './types';

export const useNormalizeQueueFormNetworkData = (): [
  NormalizeQueueFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: info,
    isPending: isInfoLoading,
    refetch: updateInfo,
  } = useOperatorInfo(nodeOperatorId);

  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: updateEthBalance,
  } = useEthereumBalance();

  const unqueuedCount = info
    ? info.depositableValidatorsCount - info.enqueuedCount
    : undefined;

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo(), updateEthBalance()]);
  }, [updateEthBalance, updateInfo]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
      isEthBalanceLoading,
    }),
    [isEthBalanceLoading, isInfoLoading],
  );

  return [
    {
      nodeOperatorId,
      info,
      unqueuedCount,
      ethBalance,
      loading,
    },
    revalidate,
  ];
};
