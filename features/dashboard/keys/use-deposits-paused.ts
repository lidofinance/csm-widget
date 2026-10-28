import {
  useNodeOperatorId,
  useOperatorGroupId,
  useOperatorWeight,
} from 'modules/web3';

export const useDepositsPaused = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId, isPending: isGroupPending } = useOperatorGroupId({
    nodeOperatorId,
  });
  const { data: weight, isPending: isWeightPending } = useOperatorWeight({
    nodeOperatorId,
  });

  return {
    isPending: isGroupPending || isWeightPending,
    isPaused: !groupId || !weight,
    hasGroup: !!groupId,
  };
};
