import { useCallback, useMemo } from 'react';
import { useEthereumBalance } from '@lido-sdk/react';
import {
  useMaxGasPrice,
  useNodeOperatorBalance,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { type AddBondFormNetworkData } from '../context/types';
import { useNodeOperatorId } from 'providers/node-operator-provider';

export const useAddBondFormNetworkData = (): AddBondFormNetworkData => {
  const nodeOperatorId = useNodeOperatorId();
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
    data: bond,
    update: updateBondBalance,
    initialLoading: isBondBalanceLoading,
  } = useNodeOperatorBalance(nodeOperatorId);

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      updateBondBalance(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateBondBalance,
  ]);

  const loading = useMemo(
    () => ({
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isBondBalanceLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    }),
    [
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isBondBalanceLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    ],
  );

  return {
    etherBalance,
    stethBalance,
    wstethBalance,
    bondBalance: bond?.current,
    bondRequired: bond?.required,
    nodeOperatorId,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    maxGasPrice,
    loading,
    revalidate,
  };
};
