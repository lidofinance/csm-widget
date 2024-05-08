import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCallback, useMemo } from 'react';
import {
  useMaxGasPrice,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { useStethSubmitGasLimit } from '../hooks';
import { type SubmitKeysFormNetworkData } from './types';

export const useSubmitKeysFormNetworkData = (): SubmitKeysFormNetworkData => {
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

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const gasLimit = useStethSubmitGasLimit();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const gasCost = useMemo(
    () => (gasLimit && maxGasPrice ? gasLimit.mul(maxGasPrice) : undefined),
    [gasLimit, maxGasPrice],
  );

  const {
    data: etherBalance,
    update: updateEtherBalance,
    initialLoading: isEtherBalanceLoading,
  } = useEthereumBalance(undefined, STRATEGY_LAZY);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance,
      updateWstethBalance,
      updateEtherBalance,
    ]);
  }, [updateStethBalance, updateWstethBalance, updateEtherBalance]);

  const loading = useMemo(
    () => ({
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
      isEtherBalanceLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
      isEtherBalanceLoading,
    ],
  );

  return {
    stethBalance,
    wstethBalance,
    etherBalance,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    gasCost,
    gasLimit,
    loading,
    revalidate,
  };
};
