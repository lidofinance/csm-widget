import { OperatorQueue } from '../types';
import { QueueAnalysis } from './calculate-and-select-by-operator';
import type { GraphBounds, OperatorBatch } from './enhanced-types';
import { normalizeToGraphCoordinate } from './graph-calculations';

type BatchInfo = {
  keysCount: bigint;
  absoluteOffset: bigint; // Position from the start of all queues
  priority: number;
  queueStartPos: bigint; // Where this queue starts in absolute terms
  queueSize: bigint; // Total keys in this queue
};

type CollectOperatorBatchesProps = {
  queueDataList: QueueAnalysis[];
  activeKeys: bigint;
  depositableLimit: bigint;
  bounds: GraphBounds;
};

/**
 * Collects all operator batches from multiple priority queues,
 * converts them to graph coordinates, and combines adjacent batches.
 */
export const collectOperatorBatches = ({
  queueDataList,
  activeKeys,
  depositableLimit,
  bounds,
}: CollectOperatorBatchesProps): OperatorQueue => {
  const allBatchInfos: BatchInfo[] = [];
  let cumulativeKeys = 0n;
  let depositableKeysUsed = 0n;

  // Collect all batch information
  queueDataList.forEach((queueData) => {
    const queueStartPos = activeKeys + cumulativeKeys;
    const keysCountInQueue = queueData.totalKeysInQueue;

    queueData.operatorBatches.forEach((batch) => {
      const batchKeysCount = BigInt(batch.keysCount);
      const batchOffset = batch.offset;

      // Check if we still have depositable limit
      if (depositableKeysUsed >= depositableLimit) {
        return;
      }

      // Trim to depositable limit
      const remainingLimit = depositableLimit - depositableKeysUsed;
      const trimmedKeysCount =
        batchKeysCount > remainingLimit ? remainingLimit : batchKeysCount;

      if (trimmedKeysCount > 0n) {
        allBatchInfos.push({
          keysCount: trimmedKeysCount,
          absoluteOffset: queueStartPos + batchOffset,
          priority: queueData.queueIndex,
          queueStartPos,
          queueSize: keysCountInQueue,
        });

        depositableKeysUsed += trimmedKeysCount;
      }
    });

    cumulativeKeys += keysCountInQueue;
  });

  // Convert to graph coordinates and combine adjacent batches
  const graphBatches = convertToGraphBatches(allBatchInfos, bounds);
  const combinedBatches = combineAdjacentBatches(graphBatches);

  return {
    keysCount: depositableLimit,
    batches: combinedBatches,
  };
};

/**
 * Converts batch information to graph coordinates with normalized positions.
 */
const convertToGraphBatches = (
  batchInfos: BatchInfo[],
  bounds: GraphBounds,
): OperatorBatch[] => {
  const minSize = bounds.minSegmentSize;

  return batchInfos.map((batchInfo) => {
    const startPos = normalizeToGraphCoordinate(
      batchInfo.absoluteOffset,
      bounds,
    );
    const endPos = normalizeToGraphCoordinate(
      batchInfo.absoluteOffset + batchInfo.keysCount,
      bounds,
    );

    const size = Math.max(minSize, endPos - startPos);

    return {
      offset: startPos,
      width: size,
    };
  });
};

/**
 * Combines adjacent or overlapping batches to reduce visual clutter.
 * Uses a 0.5% tolerance for determining adjacency.
 */
const combineAdjacentBatches = (batches: OperatorBatch[]): OperatorBatch[] => {
  if (batches.length <= 1) return batches;

  // Sort by offset
  const sortedBatches = [...batches].sort((a, b) => a.offset - b.offset);
  const combined: OperatorBatch[] = [];

  let current = sortedBatches[0];

  for (let i = 1; i < sortedBatches.length; i++) {
    const next = sortedBatches[i];
    const currentEnd = current.offset + current.width;

    // Check if batches are adjacent or overlapping (with small tolerance for visual proximity)
    const isAdjacent = Math.abs(next.offset - currentEnd) <= 0.5; // 0.5% tolerance

    if (isAdjacent) {
      // Combine batches
      const combinedEnd = Math.max(currentEnd, next.offset + next.width);
      current = {
        offset: current.offset,
        width: combinedEnd - current.offset,
      };
    } else {
      // Add current batch and start new one
      combined.push(current);
      current = next;
    }
  }

  // Add the last batch
  combined.push(current);

  return combined;
};
