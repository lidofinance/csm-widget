import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import {
  useCsmCurveId,
  useCsmEarlyAdoption,
  useCsmEarlyAdoptionProofConsumed,
  useCsmPaused,
  useCSMShareLimitInfo,
  useKeysAvailable,
  useKeysUploadLimit,
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

  const { data: ea, initialLoading: isEaProofLoading } = useCsmEarlyAdoption();
  const eaProof = ea?.proof;

  const { data: curveId, initialLoading: isCurveIdLoading } =
    useCsmCurveId(!!eaProof);

  const { mutate: mutateConsumed } = useCsmEarlyAdoptionProofConsumed();

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

  const { data: keysUploadLimit, initialLoading: isKeysUploadLimitLoading } =
    useKeysUploadLimit();

  const { data: keysAvailable } = useKeysAvailable({
    curveId,
    keysUploadLimit,
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
      mutateConsumed(true), // @note hack to revalidate without loading state
      updateShareLimit(),
      updateMaxStakeEther(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    mutateConsumed,
    updateShareLimit,
    updateMaxStakeEther,
  ]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
      isKeysUploadLimitLoading,
      isMaxStakeEtherLoading,
      isBlockNumberLoading,
      isStatusLoading,
      isShareLimitLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
      isKeysUploadLimitLoading,
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
      eaProof,
      curveId,
      keysUploadLimit,
      keysAvailable,
      maxStakeEther,
      shareLimit,
      isPaused: status?.isPaused || status?.isAccountingPaused,
      loading,
    },
    revalidate,
  ];
};
