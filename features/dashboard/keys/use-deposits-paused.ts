import {
  useModule,
  useNodeOperatorId,
  useOperatorGroupId,
  useOperatorWeight,
} from 'modules/web3';

export const useDepositsPaused = () => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId, isPending: isGroupPending } = useOperatorGroupId({
    nodeOperatorId,
    module,
  });
  const { data: weight, isPending: isWeightPending } = useOperatorWeight({
    nodeOperatorId,
    module,
  });

  return {
    isPending: isGroupPending || isWeightPending,
    isPaused: !groupId || !weight,
    hasGroup: !!groupId,
  };
};
