import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorInfo } from 'shared/hooks';
import { type NormalizeQueueFormNetworkData } from './types';

export const useNormalizeQueueFormNetworkData = (): [
  NormalizeQueueFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);

  const unqueuedCount = info
    ? info.depositableValidatorsCount - info.enqueuedCount
    : undefined;

  const {
    data: etherBalance,
    update: updateEtherBalance,
    initialLoading: isEtherBalanceLoading,
  } = useEthereumBalance(undefined, STRATEGY_LAZY);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo(), updateEtherBalance()]);
  }, [updateEtherBalance, updateInfo]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
      isEtherBalanceLoading,
    }),
    [isEtherBalanceLoading, isInfoLoading],
  );

  return [
    {
      nodeOperatorId,
      info,
      unqueuedCount,
      etherBalance,
      loading,
    },
    revalidate,
  ];
};
