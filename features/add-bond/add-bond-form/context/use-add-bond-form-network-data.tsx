import {
  useCsmStatus,
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorBalance,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type AddBondFormNetworkData } from '../context/types';

export const useAddBondFormNetworkData = (): [
  AddBondFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: updateEthBalance,
  } = useEthereumBalance();
  const {
    data: stethBalance,
    isPending: isStethBalanceLoading,
    refetch: updateStethBalance,
  } = useStethBalance();
  const {
    data: wstethBalance,
    isPending: isWstethBalanceLoading,
    refetch: updateWstethBalance,
  } = useWstethBalance();
  const {
    data: bond,
    isPending: isBondLoading,
    refetch: updateBond,
  } = useOperatorBalance(nodeOperatorId);
  const {
    data: maxStakeEth,
    isPending: isMaxStakeEthLoading,
    refetch: updateMaxStakeEth,
  } = useStakeLimit();

  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateEthBalance(),
      updateStethBalance(),
      updateWstethBalance(),
      updateBond(),
      updateMaxStakeEth(),
    ]);
  }, [
    updateBond,
    updateEthBalance,
    updateMaxStakeEth,
    updateStethBalance,
    updateWstethBalance,
  ]);

  const loading = useMemo(
    () => ({
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isBondLoading,
      isMaxStakeEthLoading,
      isStatusLoading,
    }),
    [
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isBondLoading,
      isMaxStakeEthLoading,
      isStatusLoading,
    ],
  );

  return [
    {
      ethBalance,
      stethBalance,
      wstethBalance,
      bond,
      nodeOperatorId,
      maxStakeEth,
      isPaused: status?.isPausedAccounting,
      loading,
    },
    revalidate,
  ];
};
