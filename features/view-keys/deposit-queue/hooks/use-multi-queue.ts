import { GraphPart } from '../types';
import type { DepositQueueAnalysis } from './calculate-and-select-by-operator';
import type {
  OperatorInfo,
  QueueGraphData,
  QueuePart,
  ShareLimit,
} from './enhanced-types';
import {
  calculateGraphBounds,
  calculateLimitOffset,
  calculateSegmentSize,
} from './graph-calculations';
import { OperatorBatchCollector } from './operator-batch-collector';

const getPriorityType = (priority: number, overLimit: boolean): GraphPart => {
  const base = `priority${priority}`;
  const result = overLimit ? `${base}OverLimit` : base;
  return result as GraphPart;
};

export const createMultiQueueVisualization = (
  operatorInfo: OperatorInfo | undefined,
  queueAnalysis: DepositQueueAnalysis,
  shareLimit: ShareLimit,
  submittingKeysCount: number | undefined,
  fullView: boolean,
): QueueGraphData => {
  const { active, queue, capacity, activeLeft } = shareLimit;
  const added = BigInt(submittingKeysCount || 0);

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

  const addedSize = calculateSegmentSize(added, queue + active, bounds);

  const limitOffset = calculateLimitOffset(capacity, bounds);

  // Process multi-queue data
  const { queueAnalysis: queues, totalKeysCount } = queueAnalysis;

  // Calculate normalization coefficient
  const normalizationFactor =
    totalKeysCount > 0n && queue > 0n
      ? Number((queue * 100n) / totalKeysCount) / 100
      : 1;

  // Initialize batch collector
  const depositableLimit = BigInt(
    operatorInfo?.depositableValidatorsCount || 0,
  );
  const batchCollector = new OperatorBatchCollector(
    depositableLimit,
    normalizationFactor,
    bounds,
  );

  // Filter and normalize queue data
  const nonEmptyQueues = queues.filter((q) => q.totalKeysInQueue > 0n);

  // Process priority queues
  const priorityQueues: QueuePart[] = [];
  let cumulativeKeys = 0n;

  nonEmptyQueues.forEach((queueData) => {
    const normalizedKeysCount = BigInt(
      Math.round(Number(queueData.totalKeysInQueue) * normalizationFactor),
    ); // TODO: think how to simplify it

    // Calculate queue segments
    const queueUnderLimit =
      activeLeft > 0n && cumulativeKeys < activeLeft
        ? cumulativeKeys + normalizedKeysCount <= activeLeft
          ? normalizedKeysCount
          : activeLeft - cumulativeKeys
        : 0n;

    const queueOverLimit = normalizedKeysCount - queueUnderLimit;
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

    cumulativeKeys += normalizedKeysCount;
  });

  // Collect all operator batches across all queues
  const operatorData = batchCollector.collectAllBatches(nonEmptyQueues, active);

  return {
    parts: [
      { type: 'active', width: activeSize, keysCount: active },
      ...priorityQueues,
      { type: 'added', width: addedSize, keysCount: added },
    ],
    limit: {
      offset: limitOffset,
      keysCount: capacity,
    },
    operator: operatorData,
    farAway: bounds.farAway,
    submittingKeysCount,
  };
};
