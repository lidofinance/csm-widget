import {
  useFeeSplits,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorRewards,
} from 'modules/web3';
import { useShowFlags } from './use-show-rule';

export const useCanEditSplits = () => {
  const nodeOperatorId = useNodeOperatorId();

  const { data: currentFeeSplits } = useFeeSplits(nodeOperatorId);
  const { data: rewards } = useOperatorRewards(nodeOperatorId);
  const { data: pendingSharesToSplit } = useOperatorBalance(
    nodeOperatorId,
    (data) => data.pendingSharesToSplit,
  );
  const { HAS_OWNER_ROLE } = useShowFlags();

  const canEditSplits =
    currentFeeSplits !== undefined &&
    rewards !== undefined &&
    HAS_OWNER_ROLE &&
    (currentFeeSplits.length === 0 || rewards.proof.length > 0) &&
    (currentFeeSplits.length === 0 || !rewards.available) &&
    !pendingSharesToSplit;

  return canEditSplits;
};
