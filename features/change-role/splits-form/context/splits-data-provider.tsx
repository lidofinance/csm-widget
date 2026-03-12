import {
  KEY_FEE_SPLITS,
  useDappStatus,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorInfo,
  useOperatorIsOwner,
  useOperatorRewards,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { type SplitsFormNetworkData } from './types';

const useSplitsFormNetworkData: NetworkData<SplitsFormNetworkData> = () => {
  const { address } = useDappStatus();
  invariant(address);

  const nodeOperatorId = useNodeOperatorId();
  const { data: rewardsAddress, isPending: isOperatorInfoPending } =
    useOperatorInfo(nodeOperatorId, (info) => info.rewardsAddress);
  const { data: currentFeeSplits, isPending: isFeeSplitsPending } =
    useFeeSplits(nodeOperatorId);
  const { data: rewards, isPending: isOperatorRewardsPending } =
    useOperatorRewards(nodeOperatorId);
  const { data: pendingSharesToSplit, isPending: isPendingSharesPending } =
    useOperatorBalance(nodeOperatorId, (data) => data.pendingSharesToSplit);
  const { data: isOwner, isPending: isOwnerPending } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_FEE_SPLITS]);
  }, [invalidate]);

  const hasPendingShares = !!pendingSharesToSplit || !!rewards?.available;

  return {
    data: {
      address,
      nodeOperatorId,
      rewardsAddress,
      currentFeeSplits,
      pendingSharesToSplit,
      hasPendingShares,
      rewards,
      isOwner: !!isOwner,
    } as SplitsFormNetworkData,
    isPending:
      isOperatorInfoPending ||
      isFeeSplitsPending ||
      isPendingSharesPending ||
      isOperatorRewardsPending ||
      isOwnerPending,
    revalidate,
  };
};

export const useSplitsFormData = useFormData<SplitsFormNetworkData>;

export const SplitsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSplitsFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
