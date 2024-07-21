import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import {
  useCsmCurveId,
  useCsmEarlyAdoption,
  useCsmEarlyAdoptionProofConsumed,
  useStakingLimitInfo,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { type SubmitKeysFormNetworkData } from './types';

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

  const { data: curveId, initialLoading: isCurveIdLoading } = useCsmCurveId(
    !!ea?.proof,
  );

  const { update: updateConsumed } = useCsmEarlyAdoptionProofConsumed();

  const {
    data: maxStakeEther,
    update: maxStakeEtherUpdate,
    initialLoading: isMaxStakeEtherLoading,
  } = useStakingLimitInfo();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      updateConsumed(),
      maxStakeEtherUpdate(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateConsumed,
    maxStakeEtherUpdate,
  ]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
      isMaxStakeEtherLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
      isMaxStakeEtherLoading,
    ],
  );

  return [
    {
      stethBalance,
      wstethBalance,
      etherBalance,
      eaProof: ea?.proof,
      curveId,
      maxStakeEther,
      loading,
    },
    revalidate,
  ] as const;
};
