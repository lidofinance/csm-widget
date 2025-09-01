import { OperatorQueue } from '../types';
import { QueueAnalysis } from './calculate-and-select-by-operator';
import type { GraphBounds, OperatorBatch } from './enhanced-types';
import { normalizeToGraphCoordinate } from './graph-calculations';

interface BatchInfo {
  keysCount: bigint;
  absoluteOffset: bigint; // Position from the start of all queues
  priority: number;
  queueStartPos: bigint; // Where this queue starts in absolute terms
  queueSize: bigint; // Total keys in this queue
}

// TODO: rewrite to functions
export class OperatorBatchCollector {
  private depositableLimit: bigint;
  private normalizationFactor: number;
  private minSize: number;
  private bounds: GraphBounds;

  constructor(
    depositableLimit: bigint,
    normalizationFactor: number,
    bounds: GraphBounds,
  ) {
    this.depositableLimit = depositableLimit;
    this.normalizationFactor = normalizationFactor;
    this.minSize = bounds.minSegmentSize;
    this.bounds = bounds;
  }

  collectAllBatches(
    queueDataList: QueueAnalysis[],
    activeKeys: bigint,
  ): OperatorQueue {
    const allBatchInfos: BatchInfo[] = [];
    let cumulativeKeys = 0n;
    let depositableKeysUsed = 0n;

    // Collect all batch information
    queueDataList.forEach((queueData) => {
      const queueStartPos = activeKeys + cumulativeKeys;

      const normalizedKeysCount = BigInt(
        Math.round(
          Number(queueData.totalKeysInQueue) * this.normalizationFactor,
        ),
      );

      queueData.operatorBatches.forEach((batch) => {
        const normalizedKeysCount = this.normalizeBatchKeys(batch.keysCount);
        const normalizedOffset = this.normalizeBatchKeys(batch.offset);

        // Check if we still have depositable limit
        if (depositableKeysUsed >= this.depositableLimit) {
          return;
        }

        // Trim to depositable limit
        const remainingLimit = this.depositableLimit - depositableKeysUsed;
        const trimmedKeysCount =
          normalizedKeysCount > remainingLimit
            ? remainingLimit
            : normalizedKeysCount;

        if (trimmedKeysCount > 0n) {
          allBatchInfos.push({
            keysCount: trimmedKeysCount,
            absoluteOffset: queueStartPos + normalizedOffset,
            priority: queueData.queueIndex,
            queueStartPos,
            queueSize: normalizedKeysCount,
          });

          depositableKeysUsed += trimmedKeysCount;
        }
      });

      cumulativeKeys += normalizedKeysCount;
    });

    // Convert to graph coordinates and combine adjacent batches
    const graphBatches = this.convertToGraphBatches(allBatchInfos);
    const combinedBatches = this.combineAdjacentBatches(graphBatches);

    return {
      keysCount: this.depositableLimit,
      batches: combinedBatches,
    };
  }

  private normalizeBatchKeys(keysCount: bigint): bigint {
    return BigInt(Math.round(Number(keysCount) * this.normalizationFactor));
  }

  private convertToGraphBatches(batchInfos: BatchInfo[]): OperatorBatch[] {
    return batchInfos.map((batchInfo) => {
      const startPos = normalizeToGraphCoordinate(
        batchInfo.absoluteOffset,
        this.bounds,
      );
      const endPos = normalizeToGraphCoordinate(
        batchInfo.absoluteOffset + batchInfo.keysCount,
        this.bounds,
      );

      const size = Math.max(this.minSize, endPos - startPos);

      return {
        offset: startPos,
        width: size,
      };
    });
  }

  private combineAdjacentBatches(batches: OperatorBatch[]): OperatorBatch[] {
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
  }
}
