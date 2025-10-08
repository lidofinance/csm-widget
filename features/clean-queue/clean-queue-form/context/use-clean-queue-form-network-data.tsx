import { useEthereumBalance } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type CleanQueueFormNetworkData } from './types';

export const useCleanQueueFormNetworkData = (): [
  CleanQueueFormNetworkData,
  () => Promise<void>,
] => {
  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: updateEthBalance,
  } = useEthereumBalance();

  const revalidate = useCallback(async () => {
    await updateEthBalance();
  }, [updateEthBalance]);

  const loading = useMemo(
    () => ({
      isEthBalanceLoading,
    }),
    [isEthBalanceLoading],
  );

  return [
    {
      ethBalance,
      loading,
    },
    revalidate,
  ];
};
