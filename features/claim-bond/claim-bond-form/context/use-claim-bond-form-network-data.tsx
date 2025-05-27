import { useCsmStatus } from 'modules/web3';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useIsContract,
  useNodeOperatorBalance,
  useNodeOperatorInfo,
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

  const { data: maxValues, initialLoading: isMaxValuesLoading } = useMaxValues({
    bond,
    rewards,
  });

  const { data: nodeOperator, initialLoading: isInfoLoading } =
    useNodeOperatorInfo(nodeOperatorId);

  const rewardsAddress = nodeOperator?.rewardAddress;

  const {
    isContract,
    isSplitter,
    isLoading: isContractLoading,
  } = useIsContract(rewardsAddress);

  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBond(), updateRewards()]);
  }, [updateBond, updateRewards]);

  const loading = useMemo(
    () => ({
      isBondLoading,
      isRewardsLoading,
      isMaxValuesLoading,
      isInfoLoading,
      isContractLoading,
      isStatusLoading,
    }),
    [
      isBondLoading,
      isContractLoading,
      isInfoLoading,
      isMaxValuesLoading,
      isRewardsLoading,
      isStatusLoading,
    ],
  );

  return [
    {
      nodeOperatorId,
      bond,
      rewards,
      maxValues,
      rewardsAddress,
      isContract,
      isSplitter,
      isPaused: status?.isPausedAccounting,
      loading,
    },
    revalidate,
  ];
};
