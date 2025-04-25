import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import {
  useCsmCurveId,
  useCsmPaused,
  useCSMShareLimitInfo,
  useKeysAvailable,
  useStakingLimitInfo,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { useBlockNumber } from 'wagmi';
import { type SubmitKeysFormNetworkData } from './types';

export const useSubmitKeysFormNetworkData = (): [
  SubmitKeysFormNetworkData,
  () => Promise<void>,
] => {
  const { data: blockNumber, isLoading: isBlockNumberLoading } =
    useBlockNumber();

  const {
    data: etherBalance,
    update: updateEtherBalance,
    initialLoading: isEtherBalanceLoading,
  } = useEthereumBalance(undefined, STRATEGY_LAZY);
  const {
    data: stethBalance,
    update: updateStethBalance,
    initialLoading: isStethBalanceLoading,
  } = useSTETHBalance(STRATEGY_LAZY);
  const {
    data: wstethBalance,
    update: updateWstethBalance,
    initialLoading: isWstethBalanceLoading,
  } = useWSTETHBalance(STRATEGY_LAZY);

  const { data: curveId, initialLoading: isCurveIdLoading } = useCsmCurveId();

  const {
    data: shareLimit,
    initialLoading: isShareLimitLoading,
    update: updateShareLimit,
  } = useCSMShareLimitInfo();

  const {
    data: maxStakeEther,
    update: updateMaxStakeEther,
    initialLoading: isMaxStakeEtherLoading,
  } = useStakingLimitInfo();

  const { data: keysAvailable } = useKeysAvailable({
    curveId,
    etherBalance,
    stethBalance,
    wstethBalance,
  });

  const { data: status, initialLoading: isStatusLoading } = useCsmPaused();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      updateShareLimit(),
      updateMaxStakeEther(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateShareLimit,
    updateMaxStakeEther,
  ]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isCurveIdLoading,
      isMaxStakeEtherLoading,
      isBlockNumberLoading,
      isStatusLoading,
      isShareLimitLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
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
      stethBalance,
      wstethBalance,
      etherBalance,
      curveId,
      keysAvailable,
      maxStakeEther,
      shareLimit,
      isPaused: status?.isPaused || status?.isAccountingPaused,
      loading,
    },
    revalidate,
  ];
};
