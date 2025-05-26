import { useCallback, useMemo } from 'react';
import { useBlockNumber } from 'wagmi';
import { type SubmitKeysFormNetworkData } from './types';
import {
  useCsmStatus,
  useCurveId,
  useEthereumBalance,
  useShareLimit,
  useShareLimitStatus,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';

export const useSubmitKeysFormNetworkData = (): [
  SubmitKeysFormNetworkData,
  () => Promise<void>,
] => {
  const { data: blockNumber, isLoading: isBlockNumberLoading } =
    useBlockNumber();
  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: ethBalanceUpdate,
  } = useEthereumBalance();
  const {
    data: stethBalance,
    isPending: isStethBalanceLoading,
    refetch: stethBalanceUpdate,
  } = useStethBalance();
  const {
    data: wstethBalance,
    isPending: isWstethBalanceLoading,
    refetch: wstethBalanceUpdate,
  } = useWstethBalance();

  const { data: curveId, isPending: isCurveIdLoading } = useCurveId();
  const {
    data: shareLimit,
    isPending: isShareLimitLoading,
    refetch: shareLimitUpdate,
  } = useShareLimit();
  const { data: shareLimitStatus } = useShareLimitStatus();
  const {
    data: maxStakeEth,
    isPending: isMaxStakeEtherLoading,
    refetch: maxStakeEthUpdate,
  } = useStakeLimit();

  // const { data: keysAvailable } = useKeysAvailable({
  //   curveId,
  //   etherBalance,
  //   stethBalance,
  //   wstethBalance,
  // });
  const keysAvailable = undefined;

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      ethBalanceUpdate(),
      stethBalanceUpdate(),
      wstethBalanceUpdate(),
      shareLimitUpdate(),
      maxStakeEthUpdate(),
    ]);
  }, [
    ethBalanceUpdate,
    stethBalanceUpdate,
    wstethBalanceUpdate,
    shareLimitUpdate,
    maxStakeEthUpdate,
  ]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEthBalanceLoading,
      isCurveIdLoading,
      isMaxStakeEtherLoading,
      isBlockNumberLoading,
      isStatusLoading,
      isShareLimitLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEthBalanceLoading,
      isCurveIdLoading,
      isMaxStakeEtherLoading,
      isBlockNumberLoading,
      isStatusLoading,
      isShareLimitLoading,
    ],
  );

  return [
    {
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
      isPaused: status?.isPaused,
      stethBalance,
      wstethBalance,
      ethBalance,
      curveId,
      keysAvailable,
      maxStakeEth,
      shareLimit,
      shareLimitStatus,
      loading,
    },
    revalidate,
  ];
};
