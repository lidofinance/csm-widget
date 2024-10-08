import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorsCount } from 'shared/hooks';
import { type StealingCancelFormNetworkData } from './types';

export const useStealingCancelFormNetworkData = (): [
  StealingCancelFormNetworkData,
  () => Promise<void>,
] => {
  const {
    data: etherBalance,
    update: updateEtherBalance,
    initialLoading: isEtherBalanceLoading,
  } = useEthereumBalance(undefined, STRATEGY_LAZY);

  const {
    data: nodeOperatorsCount,
    initialLoading: isNodeOperatorsCountLoading,
  } = useNodeOperatorsCount();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateEtherBalance()]);
  }, [updateEtherBalance]);

  const loading = useMemo(
    () => ({
      isEtherBalanceLoading,
      isNodeOperatorsCountLoading,
    }),
    [isEtherBalanceLoading, isNodeOperatorsCountLoading],
  );

  return [
    {
      etherBalance,
      nodeOperatorsCount,
      loading,
    },
    revalidate,
  ];
};
