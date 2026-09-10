import { DepositQueueBatch, NodeOperatorId } from '@lidofinance/lido-csm-sdk';

// getAllBatches returns one entry per priority 0..lowestPriority, in order,
// with the last entry being the general (lowest-priority) queue.
export const countPriorityKeys = (
  allBatches: DepositQueueBatch[][] | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
): number | undefined => {
  if (allBatches === undefined || nodeOperatorId === undefined) {
    return undefined;
  }

  return allBatches
    .slice(0, -1)
    .flat()
    .filter((batch) => batch.nodeOperatorId === nodeOperatorId)
    .reduce((sum, batch) => sum + batch.keysCount, 0);
};
