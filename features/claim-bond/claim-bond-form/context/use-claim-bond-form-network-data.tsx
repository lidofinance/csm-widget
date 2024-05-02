import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useMaxGasPrice, useNodeOperatorBalance } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { type ClaimBondFormNetworkData } from './types';

export const useClaimBondFormNetworkData = (): ClaimBondFormNetworkData => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: bondBalance,
    update: updateBondBalance,
    initialLoading: isBondBalanceLoading,
  } = useNodeOperatorBalance(nodeOperatorId, STRATEGY_LAZY);

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBondBalance]);
  }, [updateBondBalance]);

  const loading = useMemo(
    () => ({
      isBondBalanceLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    }),
    [isBondBalanceLoading, isMultisigLoading, isMaxGasPriceLoading],
  );

  return {
    nodeOperatorId,
    bondBalance: bondBalance?.current,
    bondRequired: bondBalance?.required,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    maxGasPrice,
    loading,
    revalidate,
  };
};
