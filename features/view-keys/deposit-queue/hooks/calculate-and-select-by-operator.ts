import { DepositQueueBatch } from '@lidofinance/lido-csm-sdk';

type OperatorBatch = {
  amount: bigint;
  offset: bigint; // Amount before this batch (from other operators)
};

export type QueueAnalysis = {
  queueIndex: number;
  totalAmountInQueue: bigint;
  operatorBatches: OperatorBatch[];
};

export type DepositQueueAnalysis = {
  totalAmount: bigint;
  queueAnalysis: QueueAnalysis[];
};

export const calculateAndSelectByOperator = (
  nodeOperatorId: bigint | undefined,
  scale: bigint,
) => {
  return (allBatches: DepositQueueBatch[][]): DepositQueueAnalysis => {
    let totalAmount = 0n;
    const queueAnalysis: QueueAnalysis[] = [];

    allBatches.forEach((batches, queueIndex) => {
      let totalAmountInQueue = 0n;
      let runningOffset = 0n;
      const operatorBatches: OperatorBatch[] = [];

      batches.forEach((batch) => {
        const isOperatorBatch = batch.nodeOperatorId === nodeOperatorId;
        const batchAmount = BigInt(batch.keysCount) * scale;

        if (isOperatorBatch) {
          operatorBatches.push({
            amount: batchAmount,
            offset: runningOffset,
          });
        }

        runningOffset += batchAmount;
        totalAmountInQueue += batchAmount;
      });

      totalAmount += totalAmountInQueue;

      queueAnalysis.push({
        queueIndex,
        totalAmountInQueue,
        operatorBatches,
      });
    });

    return {
      totalAmount,
      queueAnalysis,
    };
  };
};
