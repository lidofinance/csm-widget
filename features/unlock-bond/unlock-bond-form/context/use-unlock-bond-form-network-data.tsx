import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useNodeOperatorLockAmount } from 'shared/hooks';
import { type UnlockBondFormNetworkData } from './types';
import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';

export const useUnlockBondFormNetworkData = (): UnlockBondFormNetworkData => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: lockedBond,
    update: updateLockedBond,
    initialLoading: isLockedBondLoading,
  } = useNodeOperatorLockAmount(nodeOperatorId);

  const {
    data: etherBalance,
    update: updateEtherBalance,
    initialLoading: isEtherBalanceLoading,
  } = useEthereumBalance(undefined, STRATEGY_LAZY);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateLockedBond(), updateEtherBalance()]);
  }, [updateEtherBalance, updateLockedBond]);

  const loading = useMemo(
    () => ({
      isLockedBondLoading,
      isEtherBalanceLoading,
    }),
    [isEtherBalanceLoading, isLockedBondLoading],
  );

  return {
    nodeOperatorId,
    lockedBond,
    etherBalance,
    loading,
    revalidate,
  };
};
