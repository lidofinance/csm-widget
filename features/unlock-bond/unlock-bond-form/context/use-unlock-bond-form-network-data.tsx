import {
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorBalance,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type UnlockBondFormNetworkData } from './types';

export const useUnlockBondFormNetworkData = (): [
  UnlockBondFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId<true>();

  const { data: balance, isPending: isLockedBondLoading } =
    useOperatorBalance(nodeOperatorId);

  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    // refetch: ethBalanceUpdate,
  } = useEthereumBalance();

  const revalidate = useCallback(async () => {
    // await Promise.allSettled([updateLockedBond(), updateEtherBalance()]);
  }, []);

  const loading = useMemo(
    () => ({
      isLockedBondLoading,
      isEthBalanceLoading,
    }),
    [isEthBalanceLoading, isLockedBondLoading],
  );

  return [
    {
      nodeOperatorId,
      lockedBond: balance?.locked,
      ethBalance,
      loading,
    },
    revalidate,
  ];
};
