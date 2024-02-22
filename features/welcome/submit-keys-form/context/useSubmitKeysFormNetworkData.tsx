import { useCallback, useMemo } from 'react';
import {
  useEthereumBalance,
  useSTETHBalance,
  useWSTETHBalance,
} from '@lido-sdk/react';
import { useMaxGasPrice } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { type SubmitKeysFormNetworkData } from './types';
import { useStethSubmitGasLimit } from '../hooks';
import { BytesLike } from 'ethers';

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

  const [eaProof, isEaProofLoading] = [[] as BytesLike[], false];

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
      isEaProofLoading,
    }),
    [
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
      isEtherBalanceLoading,
      isEaProofLoading,
    ],
  );

  return {
    stethBalance,
    wstethBalance,
    etherBalance,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    eaProof,
    gasCost,
    gasLimit,
    loading,
    revalidate,
  };
};
