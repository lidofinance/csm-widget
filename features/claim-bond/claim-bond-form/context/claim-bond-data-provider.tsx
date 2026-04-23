import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_REWARDS,
  useIsContract,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorRewards,
  useSmStatus,
  useStethPoolData,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { CLAIM_OPTION, type ClaimBondFormNetworkData } from './types';

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

  const { data: poolData, isPending: isPoolDataLoading } = useStethPoolData();

  const { data: nodeOperator, isPending: isInfoLoading } =
    useOperatorInfo(nodeOperatorId);

  const rewardsAddress = nodeOperator?.rewardsAddress;

  const { data: isContract, isPending: isContractLoading } =
    useIsContract(rewardsAddress);

  const { data: status, isPending: isStatusLoading } = useSmStatus();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_OPERATOR_BALANCE, KEY_OPERATOR_REWARDS]);
  }, [invalidate]);

  const isPending =
    isBondLoading ||
    isRewardsLoading ||
    isPoolDataLoading ||
    isInfoLoading ||
    isContractLoading ||
    isStatusLoading;

  const availableOptions: CLAIM_OPTION[] = [
    rewards?.available ? CLAIM_OPTION.ALL_TO_RA : undefined,
    !bond?.isInsufficient && bond?.delta ? CLAIM_OPTION.BOND_TO_RA : undefined,
    rewards?.available ? CLAIM_OPTION.REWARDS_TO_BOND : undefined,
  ].filter((o) => !!o);

  return {
    data: {
      nodeOperatorId,
      bond,
      rewards,
      poolData,
      rewardsAddress,
      isContract,
      isPaused: status?.isPausedAccounting,
      availableOptions,
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
