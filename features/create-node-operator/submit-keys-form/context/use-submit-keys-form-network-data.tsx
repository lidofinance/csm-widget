import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import {
  useCsmEarlyAdoption,
  useCsmEarlyAdoptionProofConsumed,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { useCsmCurveId } from 'shared/hooks/useCsmCurveId';
import { type SubmitKeysFormNetworkData } from './types';

export const useSubmitKeysFormNetworkData = (): SubmitKeysFormNetworkData => {
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

  const {
    data: { proof },
    initialLoading: isEaProofLoading,
  } = useCsmEarlyAdoption();

  const { data: curveId, initialLoading: isCurveIdLoading } =
    useCsmCurveId(!!proof);

  const { update: updateConsumed } = useCsmEarlyAdoptionProofConsumed();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      updateConsumed(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateConsumed,
  ]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
      isCurveIdLoading,
    ],
  );

  return {
    stethBalance,
    wstethBalance,
    etherBalance,
    eaProof: proof,
    curveId,
    loading,
    revalidate,
  };
};
