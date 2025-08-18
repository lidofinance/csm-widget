import type {
  QueueGraphData,
  UseDepositQueueGraphResult,
  BatchPart,
  QueuePart,
} from '../types';

export interface GraphBounds {
  startPosition: bigint;
  endPosition: bigint;
  range: bigint;
  displayStart: number;
  displayEnd: number;
  displayRange: number;
  minSegmentSize: number;
  extraLow: boolean;
  extraHigh: boolean;
  farAway: boolean;
}

export interface QueueSegment {
  keysUnderLimit: bigint;
  keysOverLimit: bigint;
  underLimitSize: number;
  overLimitSize: number;
  totalSize: number;
  startPosition: bigint;
}

export interface ViewConfig {
  fullView: boolean;
  minSegmentSize: number;
}

export interface ShareLimit {
  active: bigint;
  queue: bigint;
  capacity: bigint;
  activeLeft: bigint;
}

export interface OperatorInfo {
  depositableValidatorsCount?: number;
}

export interface ProcessedBatches {
  batches: BatchPart[];
  cumulativeKeys: bigint;
}

export interface SegmentInfo {
  startPos: bigint;
  underLimitKeys: bigint;
  overLimitKeys: bigint;
}

export interface GraphCalculationParams {
  active: bigint;
  queue: bigint;
  added: bigint;
  capacity: bigint;
  fullView: boolean;
}

// Re-export original types
export type {
  QueueGraphData,
  UseDepositQueueGraphResult,
  BatchPart as OperatorBatch,
  QueuePart,
};
