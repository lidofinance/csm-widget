import type { QueueUnit } from '../types';
import type {
  SubmittingAllocation,
  QueueGraphData,
  ShareLimit,
} from './enhanced-types';
import {
  calculateGraphBounds,
  calculateLimitOffset,
  calculateSegmentSize,
} from './graph-calculations';

export const createSingleQueueVisualization = (
  shareLimit: ShareLimit,
  submittingAllocation: SubmittingAllocation | undefined,
  fullView: boolean,
  unit: QueueUnit,
  scale: bigint,
): QueueGraphData => {
  const { active, queue, capacity, activeLeft } = shareLimit;
  const added = submittingAllocation?.amount || 0n;

  // Calculate graph bounds and coordinates
  const bounds = calculateGraphBounds({
    active,
    queue,
    capacity,
    added,
    fullView,
    scale,
  });

  // Calculate segment sizes
  const activeSize = calculateSegmentSize(active, 0n, bounds);

  const addedSize = calculateSegmentSize(added, queue + active, bounds);

  const limitOffset = calculateLimitOffset(capacity, bounds);

  // Calculate queue segments
  const queueUnderLimit =
    activeLeft > 0n ? (queue < activeLeft ? queue : activeLeft) : 0n;
  const queueOverLimit = queue - queueUnderLimit;

  const queueUnderLimitSize = calculateSegmentSize(
    queueUnderLimit,
    active,
    bounds,
  );

  const queueOverLimitSize = calculateSegmentSize(
    queueOverLimit,
    queueUnderLimit + active,
    bounds,
  );

  return {
    unit,
    parts: [
      { type: 'active', width: activeSize, amount: active },
      { type: 'queue', width: queueUnderLimitSize, amount: queueUnderLimit },
      {
        type: 'queueOverLimit',
        width: queueOverLimitSize,
        amount: queueOverLimit,
      },
      { type: 'added', width: addedSize, amount: added },
    ],
    limit: {
      offset: limitOffset,
      amount: capacity,
    },
    farAway: bounds.farAway,
    submittingAmount: submittingAllocation?.amount,
  };
};
