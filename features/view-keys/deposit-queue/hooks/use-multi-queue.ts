import { GraphPart } from '../types';
import type { DepositQueueAnalysis } from './calculate-and-select-by-operator';
import type {
  QueueGraphData,
  QueuePart,
  ShareLimit,
  SubmittingAllocation,
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
  queueAnalysis: DepositQueueAnalysis,
  shareLimit: ShareLimit,
  submittingAllocation: SubmittingAllocation | undefined,
  fullView: boolean,
): QueueGraphData => {
  const { active, queue, capacity, activeLeft } = shareLimit;
  const added = submittingAllocation?.keysCount || 0n;

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
  let cumulativeAddedKeys = 0n;

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
        submitting,
        active + cumulativeKeys + cumulativeAddedKeys,
        bounds,
      );

      priorityQueues.push({
        type: 'added',
        keysCount: submitting,
        width: addedPrioritySize,
        metadata: [
          {
            keysCount: submitting,
            position: cumulativeKeys + cumulativeAddedKeys,
            priority: queueData.queueIndex,
          },
        ],
      });

      cumulativeAddedKeys += submitting;
    }
  });

  const operatorData = collectOperatorBatches({
    queueDataList: queues,
    activeKeys: active,
    bounds,
    submittingAllocation,
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
