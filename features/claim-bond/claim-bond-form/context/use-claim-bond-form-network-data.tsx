import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useNodeOperatorBalance,
  useNodeOperatorLockAmount,
  useNodeOperatorRewards,
} from 'shared/hooks';
import { type ClaimBondFormNetworkData } from './types';

export const useClaimBondFormNetworkData = (): ClaimBondFormNetworkData => {
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
    }),
    [isBondLoading, isLockedBondLoading, isRewardsLoading],
  );

  return {
    nodeOperatorId,
    bond,
    rewards,
    lockedBond,
    loading,
    revalidate,
  };
};
