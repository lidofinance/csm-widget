import {
  useCsmStatus,
  useIsContract,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorRewards,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { type ClaimBondFormNetworkData } from './types';
import { useMaxValues } from './use-max-values';

export const useClaimBondFormNetworkData = (): [
  ClaimBondFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: bond,
    isPending: isBondLoading,
    refetch: updateBond,
  } = useOperatorBalance(nodeOperatorId);

  const {
    data: rewards,
    isPending: isRewardsLoading,
    refetch: updateRewards,
  } = useOperatorRewards(nodeOperatorId);

  const { data: maxValues, isPending: isMaxValuesLoading } = useMaxValues({
    bond,
    rewards,
  });

  const { data: nodeOperator, isPending: isInfoLoading } =
    useOperatorInfo(nodeOperatorId);

  const rewardsAddress = nodeOperator?.rewardsAddress;

  const { data: isContract, isPending: isContractLoading } =
    useIsContract(rewardsAddress);

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
      isPaused: status?.isPausedAccounting,
      loading,
    },
    revalidate,
  ];
};
