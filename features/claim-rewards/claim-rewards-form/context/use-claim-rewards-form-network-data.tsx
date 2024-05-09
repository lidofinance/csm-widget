import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useMaxGasPrice, useNodeOperatorBalance } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { useNodeOperatorRewards } from 'shared/hooks/useNodeOperatorRewardsTree';
import { type ClaimRewardsFormNetworkData } from './types';

export const useClaimRewardsFormNetworkData =
  (): ClaimRewardsFormNetworkData => {
    const nodeOperatorId = useNodeOperatorId();

    const {
      data: bond,
      update: updateBondBalance,
      initialLoading: isBondBalanceLoading,
    } = useNodeOperatorBalance(nodeOperatorId);

    const {
      data: rewards,
      update: updateRewards,
      loading: isRewardsLoading,
    } = useNodeOperatorRewards(nodeOperatorId);

    const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
    const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
      useMaxGasPrice();

    const revalidate = useCallback(async () => {
      await Promise.allSettled([updateBondBalance, updateRewards]);
    }, [updateBondBalance, updateRewards]);

    const loading = useMemo(
      () => ({
        isBondBalanceLoading,
        isMultisigLoading,
        isMaxGasPriceLoading,
        isRewardsLoading,
      }),
      [
        isBondBalanceLoading,
        isMultisigLoading,
        isMaxGasPriceLoading,
        isRewardsLoading,
      ],
    );

    return {
      nodeOperatorId,
      bondBalance: bond?.current,
      bondRequired: bond?.required,
      availableRewards: rewards?.available,
      totalRewards: rewards?.shares,
      proof: rewards?.proof,
      isMultisig: isMultisigLoading ? undefined : isMultisig,
      maxGasPrice,
      loading,
      revalidate,
    };
  };
