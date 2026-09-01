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

export type QueueUnit = 'keys' | 'eth';

type Amount = {
  amount: bigint;
};

export type QueuePart = {
  width: number;
  type: GraphPart;
  metadata?: BatchMetadata;
} & Amount;

export type QueueLimit = {
  offset: number;
} & Amount;

export type BatchMetadata = Array<{
  amount: bigint;
  position: bigint;
  priority: number;
  combined?: boolean;
}>;

export type BatchPart = {
  offset: number;
  width: number;
  metadata: BatchMetadata;
};

export type OperatorQueue = {
  batches: BatchPart[];
} & Amount;

export type QueueGraphData = {
  unit: QueueUnit;
  limit: QueueLimit;
  parts: QueuePart[];
  operator?: OperatorQueue;
  farAway: boolean;
  submittingAmount?: bigint;
};

export type UseDepositQueueGraphResult = {
  isLoading: boolean;
  data?: QueueGraphData;
};
