import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useNodeOperatorBalance,
  useStakingLimitInfo,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { type AddBondFormNetworkData } from '../context/types';

export const useAddBondFormNetworkData = (): [
  AddBondFormNetworkData,
  () => Promise<void>,
] => {
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
    update: updateBond,
    initialLoading: isBondLoading,
  } = useNodeOperatorBalance(nodeOperatorId);
  const {
    data: maxStakeEther,
    update: updateMaxStakeEther,
    initialLoading: isMaxStakeEtherLoading,
  } = useStakingLimitInfo();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      updateBond(),
      updateMaxStakeEther(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateBond,
    updateMaxStakeEther,
  ]);

  const loading = useMemo(
    () => ({
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isBondLoading,
      isMaxStakeEtherLoading,
    }),
    [
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isBondLoading,
      isMaxStakeEtherLoading,
    ],
  );

  return [
    {
      etherBalance,
      stethBalance,
      wstethBalance,
      bond,
      nodeOperatorId,
      maxStakeEther,
      loading,
    },
    revalidate,
  ];
};
