import type {
  QueueGraphData,
  UseDepositQueueGraphResult,
  BatchPart,
  QueuePart,
} from '../types';

export type GraphBounds = {
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
};

export type QueueSegment = {
  keysUnderLimit: bigint;
  keysOverLimit: bigint;
  underLimitSize: number;
  overLimitSize: number;
  totalSize: number;
  startPosition: bigint;
};

export type ViewConfig = {
  fullView: boolean;
  minSegmentSize: number;
};

export type ShareLimit = {
  active: bigint;
  queue: bigint;
  capacity: bigint;
  activeLeft: bigint;
};

export type OperatorInfo = {
  depositableValidatorsCount?: number;
  totalDepositedKeys?: number;
  enqueuedCount?: number;
};

export type SubmittingAllocation = {
  keysCount: number;
  allocation: [number, number][];
}; // queue priority, keys count

export type ProcessedBatches = {
  batches: BatchPart[];
  cumulativeKeys: bigint;
};

export type SegmentInfo = {
  startPos: bigint;
  underLimitKeys: bigint;
  overLimitKeys: bigint;
};

export type GraphCalculationParams = {
  active: bigint;
  queue: bigint;
  added: bigint;
  capacity: bigint;
  fullView: boolean;
};

// Re-export original types
export type { QueueGraphData, UseDepositQueueGraphResult, QueuePart };
