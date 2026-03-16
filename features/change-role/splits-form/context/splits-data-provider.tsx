import {
  KEY_FEE_SPLITS,
  useDappStatus,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorBalance,
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

  const emptySplits = !currentFeeSplits?.length;

  // TODO: separate hook for dashboard SetUp button
  const editRestricted =
    !isOwner ||
    !(emptySplits || rewards?.proof.length) ||
    !(emptySplits || !rewards?.available) ||
    !!pendingSharesToSplit;

  return {
    data: {
      address,
      nodeOperatorId,
      currentFeeSplits,
      pendingSharesToSplit,
      rewards,
      isOwner,
      editRestricted,
    } as SplitsFormNetworkData,
    isPending:
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
