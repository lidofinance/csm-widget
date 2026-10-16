import { useModule, useNodeOperatorId } from 'modules/web3';
import { useDepositQueueBatches } from 'modules/web3/hooks/use-deposit-queue-batches';
import { useOperatorInfo } from 'modules/web3/hooks/use-operator-info';
import { countPriorityKeys } from './count-priority-keys';

type MaxPriorityKeyIndex = {
  index: number | undefined;
  isPending: boolean;
  isError: boolean;
};

export const useMaxPriorityKeyIndex = (): MaxPriorityKeyIndex => {
  const nodeOperatorId = useNodeOperatorId();
  const { isCsmFamily } = useModule();

  const {
    data: priorityKeys,
    isPending: isBatchesPending,
    isError: isBatchesError,
  } = useDepositQueueBatches((allBatches) =>
    countPriorityKeys(allBatches, nodeOperatorId),
  );
  const {
    data: operatorInfo,
    isPending: isOperatorPending,
    isError: isOperatorError,
  } = useOperatorInfo({ nodeOperatorId });

  // No priority queue outside the CSM family; useDepositQueueBatches never
  // fetches there and would otherwise stay "pending" forever.
  if (!isCsmFamily) {
    return { index: undefined, isPending: false, isError: false };
  }

  const isPending = isBatchesPending || isOperatorPending;
  const isError = isBatchesError || isOperatorError;

  if (isPending || isError || !operatorInfo || priorityKeys === undefined) {
    return { index: undefined, isPending, isError };
  }

  return {
    index: operatorInfo.totalDepositedKeys + priorityKeys - 1,
    isPending,
    isError,
  };
};
