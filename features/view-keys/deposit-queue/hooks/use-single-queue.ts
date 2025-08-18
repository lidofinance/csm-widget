import type { QueueGraphData, ShareLimit } from './enhanced-types';
import {
  calculateGraphBounds,
  calculateLimitOffset,
  calculateSegmentSize,
} from './graph-calculations';

export const createSingleQueueVisualization = (
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
    parts: [
      { type: 'active', width: activeSize, keysCount: active },
      { type: 'queue', width: queueUnderLimitSize, keysCount: queueUnderLimit },
      {
        type: 'queueOverLimit',
        width: queueOverLimitSize,
        keysCount: queueOverLimit,
      },
      { type: 'added', width: addedSize, keysCount: added },
    ],
    limit: {
      offset: limitOffset,
      keysCount: capacity,
    },
    farAway: bounds.farAway,
    submittingKeysCount,
  };
};
