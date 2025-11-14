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
  metadata?: BatchMetadata;
} & KeysCount;

export type QueueLimit = {
  offset: number;
} & KeysCount;

export type BatchMetadata = Array<{
  keysCount: bigint;
  position: bigint;
  priority: number;
}>;

export type BatchPart = {
  offset: number;
  width: number;
  metadata: BatchMetadata;
};

export type OperatorQueue = {
  batches: BatchPart[];
} & KeysCount;

export type QueueGraphData = {
  limit: QueueLimit;
  parts: QueuePart[];
  operator?: OperatorQueue;
  farAway: boolean;
  submittingKeysCount?: bigint;
};

export type UseDepositQueueGraphResult = {
  isLoading: boolean;
  data?: QueueGraphData;
};
