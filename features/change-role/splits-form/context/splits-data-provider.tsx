import {
  KEY_FEE_SPLITS,
  useDappStatus,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorRewards,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useCanEditSplits, useInvalidate, useShowFlags } from 'shared/hooks';
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

  const canEdit = useCanEditSplits();
  const { HAS_OWNER_ROLE: isOwner } = useShowFlags();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_FEE_SPLITS]);
  }, [invalidate]);

  return {
    data: {
      address,
      nodeOperatorId,
      currentFeeSplits,
      pendingSharesToSplit,
      rewards,
      canEdit,
      isOwner,
    } as SplitsFormNetworkData,
    isPending:
      isFeeSplitsPending || isPendingSharesPending || isOperatorRewardsPending,
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
