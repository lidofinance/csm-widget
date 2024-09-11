import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import {
  useCsmCurveId,
  useCsmEarlyAdoption,
  useCsmEarlyAdoptionProofConsumed,
  useKeysUploadLimit,
  useStakingLimitInfo,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { type SubmitKeysFormNetworkData } from './types';
import { useKeysAvailable } from 'shared/hooks';

export const useSubmitKeysFormNetworkData = (): [
  SubmitKeysFormNetworkData,
  () => Promise<void>,
] => {
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
    data: maxStakeEther,
    update: updateMaxStakeEther,
    initialLoading: isMaxStakeEtherLoading,
  } = useStakingLimitInfo();

  const {
    data: keysUploadLimit,
    update: updateKeysUploadLimit,
    initialLoading: isKeysUploadLimitLoading,
  } = useKeysUploadLimit();

  const { data: keysAvailable } = useKeysAvailable({
    curveId,
    keysUploadLimit,
    etherBalance,
    stethBalance,
    wstethBalance,
  });

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      mutateConsumed(true), // @note hack to revalidate without loading state
      updateMaxStakeEther(),
      updateKeysUploadLimit(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    mutateConsumed,
    updateMaxStakeEther,
    updateKeysUploadLimit,
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
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
      isKeysUploadLimitLoading,
      isMaxStakeEtherLoading,
    ],
  );

  return [
    {
      stethBalance,
      wstethBalance,
      etherBalance,
      eaProof,
      curveId,
      keysUploadLimit,
      keysAvailable,
      maxStakeEther,
      loading,
    },
    revalidate,
  ];
};
