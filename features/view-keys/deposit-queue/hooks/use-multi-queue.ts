import { GraphPart } from '../types';
import type { DepositQueueAnalysis } from './calculate-and-select-by-operator';
import type {
  OperatorInfo,
  SubmittingAllocation,
  QueueGraphData,
  QueuePart,
  ShareLimit,
} from './enhanced-types';
import {
  calculateGraphBounds,
  calculateLimitOffset,
  calculateSegmentSize,
} from './graph-calculations';
import { collectOperatorBatches } from './operator-batch-collector';

const getPriorityType = (priority: number, overLimit: boolean): GraphPart => {
  const base = `priority${priority}`;
  const result = overLimit ? `${base}OverLimit` : base;
  return result as GraphPart;
};

export const createMultiQueueVisualization = (
  operatorInfo: OperatorInfo | undefined,
  queueAnalysis: DepositQueueAnalysis,
  shareLimit: ShareLimit,
  submittingAllocation: SubmittingAllocation | undefined,
  fullView: boolean,
): QueueGraphData => {
  const { active, queue, capacity, activeLeft } = shareLimit;
  const added = BigInt(submittingAllocation?.keysCount || 0);

  // Calculate graph bounds and coordinates
  const bounds = calculateGraphBounds({
    active,
    queue,
    capacity,
    added,
    fullView,
  });

  // Calculate segment sizes
  const activeSize = calculateSegmentSize(active, 0n, bounds);

  const limitOffset = calculateLimitOffset(capacity, bounds);

  // Process multi-queue data
  const { queueAnalysis: queues } = queueAnalysis;

  // Process priority queues and insert added keys at appropriate positions
  const priorityQueues: QueuePart[] = [];
  let cumulativeKeys = 0n;

  queues.forEach((queueData) => {
    if (queueData.totalKeysInQueue > 0n) {
      const keysInQueue = queueData.totalKeysInQueue;

      // Calculate queue segments
      const queueUnderLimit =
        activeLeft > 0n && cumulativeKeys < activeLeft
          ? cumulativeKeys + keysInQueue <= activeLeft
            ? keysInQueue
            : activeLeft - cumulativeKeys
          : 0n;

      const queueOverLimit = keysInQueue - queueUnderLimit;
      const segmentStartPos = active + cumulativeKeys;

      const underLimitSize = calculateSegmentSize(
        queueUnderLimit,
        segmentStartPos,
        bounds,
      );

      const overLimitSize = calculateSegmentSize(
        queueOverLimit,
        segmentStartPos + queueUnderLimit,
        bounds,
      );

      priorityQueues.push(
        {
          type: getPriorityType(queueData.queueIndex, false),
          keysCount: queueUnderLimit,
          width: underLimitSize,
        },
        {
          type: getPriorityType(queueData.queueIndex, true),
          keysCount: queueOverLimit,
          width: overLimitSize,
        },
      );

      cumulativeKeys += keysInQueue;
    }

    const [, submitting] =
      submittingAllocation?.allocation?.find(
        ([priority]) => priority === queueData.queueIndex,
      ) || [];

    if (submitting) {
      const addedPrioritySize = calculateSegmentSize(
        BigInt(submitting),
        active + cumulativeKeys,
        bounds,
      );

      priorityQueues.push({
        type: 'added',
        keysCount: BigInt(submitting),
        width: addedPrioritySize,
      });
    }
  });

  // Collect all operator batches across all queues
  const depositableLimit = BigInt(
    operatorInfo?.depositableValidatorsCount || 0,
  );
  const operatorData = collectOperatorBatches({
    queueDataList: queues,
    activeKeys: active,
    depositableLimit,
    bounds,
  });

  return {
    parts: [
      { type: 'active', width: activeSize, keysCount: active },
      ...priorityQueues,
    ],
    limit: {
      offset: limitOffset,
      keysCount: capacity,
    },
    operator: operatorData,
    farAway: bounds.farAway,
    submittingKeysCount: submittingAllocation?.keysCount,
  };
};
