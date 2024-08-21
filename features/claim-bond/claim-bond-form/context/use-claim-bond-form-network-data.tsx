import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorBalance, useNodeOperatorRewards } from 'shared/hooks';
import { type ClaimBondFormNetworkData } from './types';
import { useMaxValues } from './use-max-values';

export const useClaimBondFormNetworkData = (): [
  ClaimBondFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: bond,
    update: updateBond,
    initialLoading: isBondLoading,
  } = useNodeOperatorBalance(nodeOperatorId);

  const {
    data: rewards,
    update: updateRewards,
    initialLoading: isRewardsLoading,
  } = useNodeOperatorRewards(nodeOperatorId);

  const { data: maxValues, initialLoading: isMaxValuesLoading } = useMaxValues({
    bond,
    rewards,
  });

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBond(), updateRewards()]);
  }, [updateBond, updateRewards]);

  const loading = useMemo(
    () => ({
      isBondLoading,
      isRewardsLoading,
      isMaxValuesLoading,
    }),
    [isBondLoading, isMaxValuesLoading, isRewardsLoading],
  );

  return [
    {
      nodeOperatorId,
      bond,
      rewards,
      maxValues,
      loading,
    },
    revalidate,
  ];
};
