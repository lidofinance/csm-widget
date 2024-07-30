import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useNodeOperatorBalance,
  useNodeOperatorLockAmount,
  useNodeOperatorRewards,
} from 'shared/hooks';
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

  const {
    data: lockedBond,
    update: updateLockedBond,
    initialLoading: isLockedBondLoading,
  } = useNodeOperatorLockAmount(nodeOperatorId);

  const { data: maxValues, initialLoading: isMaxValuesLoading } = useMaxValues({
    bond,
    rewards,
    lockedBond,
  });

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateBond(),
      updateRewards(),
      updateLockedBond(),
    ]);
  }, [updateBond, updateLockedBond, updateRewards]);

  const loading = useMemo(
    () => ({
      isBondLoading,
      isRewardsLoading,
      isLockedBondLoading,
      isMaxValuesLoading,
    }),
    [isBondLoading, isLockedBondLoading, isMaxValuesLoading, isRewardsLoading],
  );

  return [
    {
      nodeOperatorId,
      bond,
      rewards,
      lockedBond,
      maxValues,
      loading,
    },
    revalidate,
  ];
};
