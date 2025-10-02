import { DepositQueueBatch } from '@lidofinance/lido-csm-sdk';

type OperatorBatch = {
  keysCount: bigint;
  offset: bigint; // Keys count before this batch (from other operators)
};

export type QueueAnalysis = {
  queueIndex: number;
  totalKeysInQueue: bigint;
  operatorBatches: OperatorBatch[];
};

export type DepositQueueAnalysis = {
  totalKeysCount: bigint;
  queueAnalysis: QueueAnalysis[];
};

export const calculateAndSelectByOperator = (
  nodeOperatorId: bigint | undefined,
) => {
  return (allBatches: DepositQueueBatch[][]): DepositQueueAnalysis => {
    let totalKeysCount = 0n;
    const queueAnalysis: QueueAnalysis[] = [];

    allBatches.forEach((batches, queueIndex) => {
      let totalKeysInQueue = 0n;
      let runningOffset = 0n;
      const operatorBatches: OperatorBatch[] = [];

      batches.forEach((batch) => {
        const isOperatorBatch = batch.nodeOperatorId === nodeOperatorId;

        if (isOperatorBatch) {
          operatorBatches.push({
            keysCount: batch.keysCount,
            offset: runningOffset,
          });
        }

        runningOffset += batch.keysCount;
        totalKeysInQueue += batch.keysCount;
      });

      totalKeysCount += totalKeysInQueue;

      queueAnalysis.push({
        queueIndex,
        totalKeysInQueue,
        operatorBatches,
      });
    });

    return {
      totalKeysCount,
      queueAnalysis,
    };
  };
};
