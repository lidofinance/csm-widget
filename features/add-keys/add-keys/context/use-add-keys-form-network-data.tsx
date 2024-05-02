import {
  useEthereumBalance,
  useSTETHBalance,
  useWSTETHBalance,
} from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useMaxGasPrice, useNodeOperatorBalance } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { useStethSubmitGasLimit } from '../hooks/useStethSubmitGasLimit';
import { type AddKeysFormNetworkData } from './types';

export const useAddKeysFormNetworkData = (): AddKeysFormNetworkData => {
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
  const gasLimit = useStethSubmitGasLimit();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const gasCost = useMemo(
    () => (gasLimit && maxGasPrice ? gasLimit.mul(maxGasPrice) : undefined),
    [gasLimit, maxGasPrice],
  );

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance,
      updateWstethBalance,
      updateEtherBalance,
      updateBondBalance,
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
    stethBalance,
    wstethBalance,
    etherBalance,
    bondBalance: bond?.current,
    bondRequired: bond?.required,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    gasCost,
    gasLimit,
    loading,
    revalidate,
  };
};
