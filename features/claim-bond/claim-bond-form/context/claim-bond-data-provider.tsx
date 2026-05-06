import { convertEthToShares, TOKENS } from '@lidofinance/lido-csm-sdk';
import { MAX_ETH_AMOUNT } from 'consts/tokens';
import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_REWARDS,
  useFeeSplits,
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
import { bigMax, calculateAvailableToClaim } from 'utils';
import {
  CLAIM_OPTION,
  type ClaimBondFormNetworkData,
  type MaxValues,
} from './types';

const limitMaxEth = (value: bigint) =>
  value > MAX_ETH_AMOUNT ? MAX_ETH_AMOUNT : value;

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

  const { data: feeSplits, isPending: isFeeSplitsLoading } =
    useFeeSplits(nodeOperatorId);

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
    isStatusLoading ||
    isFeeSplitsLoading;

  const claimableBond = calculateAvailableToClaim({ bond, feeSplits });
  const claimableBondAndRewards = calculateAvailableToClaim({
    bond,
    rewards,
    feeSplits,
  });

  const claimableMaxValues: MaxValues | undefined = poolData
    ? {
        [TOKENS.eth]: [
          limitMaxEth(claimableBond),
          limitMaxEth(claimableBondAndRewards),
        ],
        [TOKENS.steth]: [claimableBond, claimableBondAndRewards],
        [TOKENS.wsteth]: [
          convertEthToShares(claimableBond, poolData),
          convertEthToShares(claimableBondAndRewards, poolData),
        ],
      }
    : undefined;

  const realInsufficient = bond
    ? bigMax(0n, bond.required + bond.locked + bond.debt - bond.current)
    : 0n;
  const realExcess = bond
    ? bigMax(0n, bond.current - bond.required - bond.locked - bond.debt)
    : 0n;
  const rewardsRemainder = rewards
    ? bigMax(0n, rewards.available - realInsufficient)
    : 0n;
  const totalShare = feeSplits?.reduce((sum, s) => sum + s.share, 0n) ?? 0n;

  const availableOptions = [
    rewards?.available && CLAIM_OPTION.ALL_TO_RA,
    claimableBond > 0n && CLAIM_OPTION.BOND_TO_RA,
    rewards?.available &&
      claimableBondAndRewards > 0n &&
      CLAIM_OPTION.REWARDS_TO_BOND,
  ].filter((o): o is CLAIM_OPTION => !!o);

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
      feeSplits,
      calculation: {
        claimableBond,
        claimableBondAndRewards,
        claimableMaxValues,
        realInsufficient,
        realExcess,
        rewardsRemainder,
        totalShare,
      },
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
