import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import {
  useFeeSplits,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorRewards,
} from 'modules/web3';

export const useBondStats = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: bond, isPending: isBondPending } = useOperatorBalance({
    nodeOperatorId,
  });
  const { data: rewards, isPending: isRewardsPending } = useOperatorRewards({
    nodeOperatorId,
  });
  const { data: feeSplits, isPending: isSplitsPending } = useFeeSplits({
    nodeOperatorId,
  });

  const totalShare = feeSplits?.reduce((sum, s) => sum + s.share, 0n) ?? 0n;
  const splittable = ((rewards?.available ?? 0n) * totalShare) / PERCENT_BASIS;

  return {
    bond,
    rewards,
    splittable,
    isPending: isBondPending || isRewardsPending || isSplitsPending,
  };
};
