import { BatchPart, OperatorQueue } from '../types';
import { QueueAnalysis } from './calculate-and-select-by-operator';
import type { GraphBounds, SubmittingAllocation } from './enhanced-types';
import { normalizeToGraphCoordinate } from './graph-calculations';

const MAX_TOOLTIP_ITEMS = 2;

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
        queueOffset: cumulativeKeys + submittingKeys + batchOffset,
        batchOffset,
        priority: queueData.queueIndex,
      });
    });

    cumulativeKeys += keysCountInQueue;

    // Include submitting keys for this priority in cumulative position
    const submittingKeysInPriority =
      submittingAllocation?.allocation?.find(
        ([priority]) => priority === queueData.queueIndex,
      )?.[1] || 0n;
    submittingKeys += submittingKeysInPriority;
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
 * Merges two metadata arrays, combining consecutive entries with same priority.
 */
const mergeMetadataArrays = (
  first: BatchPart['metadata'] = [],
  second: BatchPart['metadata'] = [],
): BatchPart['metadata'] => {
  if (first.length > 0 && second.length > 0) {
    const lastMeta = first[first.length - 1];
    const firstMeta = second[0];

    const isConsecutive =
      lastMeta.position + lastMeta.keysCount === firstMeta.position &&
      lastMeta.priority === firstMeta.priority;

    if (isConsecutive) {
      const mergedMeta = {
        position: lastMeta.position,
        keysCount: lastMeta.keysCount + firstMeta.keysCount,
        priority: lastMeta.priority,
      };
      return [...first.slice(0, -1), mergedMeta, ...second.slice(1)];
    }
  }

  return [...first, ...second];
};

/**
 * Ensures batch metadata doesn't exceed MAX_TOOLTIP_ITEMS.
 * If exceeded, combines all metadata into a single entry with summed keys.
 */
const ensureMetadataWithinTooltipLimit = (batch: BatchPart): BatchPart => {
  if (batch.metadata.length > MAX_TOOLTIP_ITEMS) {
    const totalKeysCount = batch.metadata.reduce(
      (sum, meta) => sum + meta.keysCount,
      0n,
    );
    const firstMeta = batch.metadata[0];

    return {
      ...batch,
      metadata: [
        {
          keysCount: totalKeysCount,
          position: firstMeta.position,
          priority: firstMeta.priority,
          combined: true,
        },
      ],
    };
  }

  return batch;
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
    const isAdjacent = next.offset - currentEnd <= 0.5; // 0.5px tolerance

    if (isAdjacent) {
      // Combine batches by merging metadata arrays
      const combinedEnd = Math.max(currentEnd, next.offset + next.width);

      current = {
        offset: current.offset,
        width: combinedEnd - current.offset,
        metadata: mergeMetadataArrays(current.metadata, next.metadata),
      };
    } else {
      // Add current batch and start new one
      combined.push(ensureMetadataWithinTooltipLimit(current));
      current = next;
    }
  }

  // Add the last batch
  combined.push(ensureMetadataWithinTooltipLimit(current));

  return combined;
};
