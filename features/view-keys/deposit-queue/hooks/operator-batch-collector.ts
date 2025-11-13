import { BatchPart, OperatorQueue } from '../types';
import { QueueAnalysis } from './calculate-and-select-by-operator';
import type { GraphBounds, SubmittingAllocation } from './enhanced-types';
import { normalizeToGraphCoordinate } from './graph-calculations';

type BatchInfo = {
  keysCount: bigint;
  absoluteOffset: bigint; // Position from the begining of active keys
  queueOffset: bigint; // Position from the start of all queues
  batchOffset: bigint; // Offset within its own queue
  priority: number;
};

type CollectOperatorBatchesProps = {
  queueDataList: QueueAnalysis[];
  activeKeys: bigint;
  bounds: GraphBounds;
  submittingAllocation?: SubmittingAllocation;
};

/**
 * Collects all operator batches from multiple priority queues,
 * converts them to graph coordinates, and combines adjacent batches.
 */
export const collectOperatorBatches = ({
  queueDataList,
  activeKeys,
  bounds,
  submittingAllocation,
}: CollectOperatorBatchesProps): OperatorQueue => {
  const allBatchInfos: BatchInfo[] = [];
  let cumulativeKeys = 0n;
  let submittingKeys = 0n;

  // Collect all batch information
  queueDataList.forEach((queueData) => {
    const keysCountInQueue = queueData.totalKeysInQueue;

    queueData.operatorBatches.forEach((batch) => {
      const batchKeysCount = BigInt(batch.keysCount);
      const batchOffset = batch.offset;

      allBatchInfos.push({
        keysCount: batchKeysCount,
        absoluteOffset:
          activeKeys + cumulativeKeys + submittingKeys + batchOffset,
        queueOffset: cumulativeKeys + batchOffset,
        batchOffset,
        priority: queueData.queueIndex,
      });
    });

    cumulativeKeys += keysCountInQueue;

    // Include submitting keys for this priority in cumulative position
    const submittingKeysInPriority =
      submittingAllocation?.allocation?.find(
        ([priority]) => priority === queueData.queueIndex,
      )?.[1] || 0;
    submittingKeys += BigInt(submittingKeysInPriority);
  });

  // Convert to graph coordinates and combine adjacent batches
  const graphBatches = convertToGraphBatches(allBatchInfos, bounds);
  const combinedBatches = combineAdjacentBatches(graphBatches);

  // Sum operator batch keys only (not total queue keys)
  const operatorKeysCount = allBatchInfos.reduce(
    (sum, batch) => sum + batch.keysCount,
    0n,
  );

  return {
    keysCount: operatorKeysCount,
    batches: combinedBatches,
  };
};

/**
 * Converts batch information to graph coordinates with normalized positions.
 */
const convertToGraphBatches = (
  batchInfos: BatchInfo[],
  bounds: GraphBounds,
): BatchPart[] => {
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
      metadata: [
        {
          keysCount: batchInfo.keysCount,
          position: batchInfo.queueOffset,
          priority: batchInfo.priority,
        },
      ],
    };
  });
};

/**
 * Combines adjacent or overlapping batches to reduce visual clutter.
 * Uses a 0.5% tolerance for determining adjacency.
 * Preserves individual batch metadata for tooltips.
 */
const combineAdjacentBatches = (batches: BatchPart[]): BatchPart[] => {
  if (batches.length <= 1) return batches;

  // Sort by offset
  const sortedBatches = [...batches].sort((a, b) => a.offset - b.offset);
  const combined: BatchPart[] = [];

  let current = sortedBatches[0];

  for (let i = 1; i < sortedBatches.length; i++) {
    const next = sortedBatches[i];
    const currentEnd = current.offset + current.width;

    // Check if batches are adjacent or overlapping (with small tolerance for visual proximity)
    const isAdjacent = Math.abs(next.offset - currentEnd) <= 0.5; // 0.5% tolerance

    if (isAdjacent) {
      // Combine batches by merging metadata arrays
      const combinedEnd = Math.max(currentEnd, next.offset + next.width);

      current = {
        offset: current.offset,
        width: combinedEnd - current.offset,
        metadata: [...(current.metadata ?? []), ...(next.metadata ?? [])],
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
