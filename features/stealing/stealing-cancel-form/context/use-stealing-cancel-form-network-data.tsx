import { useEthereumBalance, useOperatorsCount } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type StealingCancelFormNetworkData } from './types';

export const useStealingCancelFormNetworkData = (): [
  StealingCancelFormNetworkData,
  () => Promise<void>,
] => {
  const {
    data: ethBalance,
    refetch: updateEthBalance,
    isPending: isEthBalanceLoading,
  } = useEthereumBalance();

  const { data: nodeOperatorsCount, isPending: isNodeOperatorsCountLoading } =
    useOperatorsCount();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateEthBalance()]);
  }, [updateEthBalance]);

  const loading = useMemo(
    () => ({
      isEthBalanceLoading,
      isNodeOperatorsCountLoading,
    }),
    [isEthBalanceLoading, isNodeOperatorsCountLoading],
  );

  return [
    {
      ethBalance,
      nodeOperatorsCount,
      loading,
    },
    revalidate,
  ];
};
