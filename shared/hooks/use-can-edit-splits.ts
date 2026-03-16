import {
  useDappStatus,
  useFeeSplits,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorIsOwner,
  useOperatorRewards,
} from 'modules/web3';

export const useCanEditSplits = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();

  const { data: currentFeeSplits } = useFeeSplits(nodeOperatorId);
  const { data: rewards } = useOperatorRewards(nodeOperatorId);
  const { data: pendingSharesToSplit } = useOperatorBalance(
    nodeOperatorId,
    (data) => data.pendingSharesToSplit,
  );
  const { data: isOwner } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });

  const emptySplits = !currentFeeSplits?.length;

  const editRestricted =
    !currentFeeSplits ||
    !rewards ||
    !isOwner ||
    !(emptySplits || rewards?.proof.length) ||
    !(emptySplits || !rewards?.available) ||
    !!pendingSharesToSplit;

  return Boolean(nodeOperatorId !== undefined && address && !editRestricted);
};
