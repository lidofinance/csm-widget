export type GraphPart =
  | 'active'
  | 'queue'
  | 'queueOverLimit'
  | 'priority0'
  | 'priority1'
  | 'priority2'
  | 'priority3'
  | 'priority4'
  | 'priority5'
  | 'priority0OverLimit'
  | 'priority1OverLimit'
  | 'priority2OverLimit'
  | 'priority3OverLimit'
  | 'priority4OverLimit'
  | 'priority5OverLimit'
  | 'added'
  | 'batch'
  | 'limit';

type KeysCount = {
  keysCount: bigint;
};

export type QueuePart = {
  width: number;
  type: GraphPart;
} & KeysCount;

export type QueueLimit = {
  offset: number;
} & KeysCount;

export type BatchPart = {
  offset: number;
  width: number;
};

export type OperatorQueue = {
  batches: BatchPart[];
} & KeysCount;

export type QueueGraphData = {
  limit: QueueLimit;
  parts: QueuePart[];
  operator?: OperatorQueue;
  farAway: boolean;
  submittingKeysCount?: number;
};

export type UseDepositQueueGraphResult = {
  isLoading: boolean;
  data?: QueueGraphData;
};
