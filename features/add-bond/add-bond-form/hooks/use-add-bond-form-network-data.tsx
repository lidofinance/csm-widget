import { useCallback, useMemo } from 'react';
import {
  useEthereumBalance,
  useSTETHBalance,
  useWSTETHBalance,
} from '@lido-sdk/react';
import { useMaxGasPrice } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { type AddBondFormNetworkData } from '../context/types';

export const useAddBondFormNetworkData = (): AddBondFormNetworkData => {
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

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

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
    etherBalance,
    stethBalance,
    wstethBalance,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    maxGasPrice,
    loading,
    revalidate,
  };
};
