import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useMaxGasPrice,
  useNodeOperatorBalance,
  useNodeOperatorInfo,
  useNodeOperatorKeys,
} from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { useStethSubmitGasLimit } from '../hooks/useStethSubmitGasLimit';
import { type RemoveKeysFormNetworkData } from './types';

export const useRemoveKeysFormNetworkData = (): RemoveKeysFormNetworkData => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: bond,
    update: updateBondBalance,
    initialLoading: isBondBalanceLoading,
  } = useNodeOperatorBalance(nodeOperatorId);
  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);
  const {
    data: keys,
    update: updateKeys,
    initialLoading: isKeysLoading,
  } = useNodeOperatorKeys(nodeOperatorId, true);

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const gasLimit = useStethSubmitGasLimit();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const gasCost = useMemo(
    () => (gasLimit && maxGasPrice ? gasLimit.mul(maxGasPrice) : undefined),
    [gasLimit, maxGasPrice],
  );

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBondBalance(), updateInfo(), updateKeys()]);
  }, [updateBondBalance, updateInfo, updateKeys]);

  const loading = useMemo(
    () => ({
      isBondBalanceLoading,
      isKeysLoading,
      isInfoLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    }),
    [
      isBondBalanceLoading,
      isKeysLoading,
      isInfoLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    ],
  );

  return {
    nodeOperatorId,
    bondBalance: bond?.current,
    bondRequired: bond?.required,
    keys,
    totalDepositedKeys: info?.totalDepositedKeys,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    gasCost,
    gasLimit,
    loading,
    revalidate,
  };
};
