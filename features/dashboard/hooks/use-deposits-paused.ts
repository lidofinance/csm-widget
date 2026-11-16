import {
  useModule,
  useNodeOperatorId,
  useOperatorGroupId,
  useOperatorWeight,
} from 'modules/web3';

export const useDepositsPaused = () => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: groupId,
    isPending: isGroupPending,
    isError: isGroupError,
  } = useOperatorGroupId({
    nodeOperatorId,
    module,
  });
  const {
    data: weight,
    isPending: isWeightPending,
    isError: isWeightError,
  } = useOperatorWeight({
    nodeOperatorId,
    module,
  });

  const isError = isGroupError || isWeightError;

  return {
    isPending: isGroupPending || isWeightPending,
    isError,
    isPaused: !isError && (!groupId || !weight),
    hasGroup: !!groupId,
  };
};
