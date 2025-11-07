import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_REWARDS,
  useCsmStatus,
  useIsContract,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorRewards,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type ClaimBondFormNetworkData } from './types';
import { useMaxValues } from './use-max-values';

const useClaimBondFormNetworkData: NetworkData<
  ClaimBondFormNetworkData
> = () => {
  const nodeOperatorId = useNodeOperatorId();

  const bondQuery = useOperatorBalance(nodeOperatorId);
  const rewardsQuery = useOperatorRewards(nodeOperatorId);

  const bond = bondQuery.data;
  const rewards = rewardsQuery.data;

  const isBondLoading = bondQuery.isPending;
  const isRewardsLoading = rewardsQuery.isPending;

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

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_OPERATOR_BALANCE, KEY_OPERATOR_REWARDS]);
  }, [invalidate]);

  const isPending =
    isBondLoading ||
    isRewardsLoading ||
    isMaxValuesLoading ||
    isInfoLoading ||
    isContractLoading ||
    isStatusLoading;

  return {
    data: {
      nodeOperatorId,
      bond,
      rewards,
      maxValues,
      rewardsAddress,
      isContract,
      isPaused: status?.isPausedAccounting,
    } as ClaimBondFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useClaimBondFormData = useFormData<ClaimBondFormNetworkData>;

export const ClaimBondDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimBondFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
