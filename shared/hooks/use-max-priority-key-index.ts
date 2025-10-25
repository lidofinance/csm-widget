import { DepositQueueBatch, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useNodeOperatorId } from 'modules/web3';
import { useDepositQueueBatches } from 'modules/web3/hooks/use-deposit-queue-batches';
import { useOperatorInfo } from 'modules/web3/hooks/use-operator-info';

const countPriorityKeys =
  (nodeOperatorId: NodeOperatorId | undefined) =>
  (allBatches: DepositQueueBatch[][]) => {
    if (!nodeOperatorId) return 0;

    const priorityQueue = allBatches[0];

    return priorityQueue
      ?.filter((batch) => batch.nodeOperatorId === nodeOperatorId)
      ?.reduce((sum, batch) => sum + batch.keysCount, 0);
  };

export const useMaxPriorityKeyIndex = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: priorityKeys } = useDepositQueueBatches(
    countPriorityKeys(nodeOperatorId),
  );
  const { data: operatorInfo } = useOperatorInfo(nodeOperatorId);

  return (operatorInfo?.totalDepositedKeys ?? 0) + (priorityKeys ?? 0) - 1;
};
