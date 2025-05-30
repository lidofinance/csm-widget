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
  const { data: ethBalance, isPending: isEthBalanceLoading } =
    useEthereumBalance();
  const { data: stethBalance, isPending: isStethBalanceLoading } =
    useStethBalance();
  const { data: wstethBalance, isPending: isWstethBalanceLoading } =
    useWstethBalance();
  const { data: bond, isPending: isBondLoading } =
    useOperatorBalance(nodeOperatorId);
  const { data: maxStakeEth, isPending: isMaxStakeEthLoading } =
    useStakeLimit();

  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const revalidate = useCallback(async () => {
    // await Promise.allSettled([
    //   updateStethBalance(),
    //   updateWstethBalance(),
    //   updateEtherBalance(),
    //   updateBond(),
    //   updateMaxStakeEther(),
    // ]);
  }, []);

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
