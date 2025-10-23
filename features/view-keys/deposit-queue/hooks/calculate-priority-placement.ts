import type { OperatorInfo, SubmittingAllocation } from './enhanced-types';

const FALLBACK_LOWEST_PRIORITY = 5;

type QueueConfig = {
  priority: number;
  maxDeposits: number;
  lowestPriority: number;
};

export const calculatePriorityPlacement = (
  operatorInfo: OperatorInfo | undefined,
  queueConfig: QueueConfig | undefined,
  submittingCount: number | undefined,
): SubmittingAllocation | undefined => {
  if (submittingCount === undefined) {
    return undefined;
  }
  if (!operatorInfo || !queueConfig || !submittingCount) {
    return {
      keysCount: submittingCount,
      allocation: submittingCount
        ? [[FALLBACK_LOWEST_PRIORITY, submittingCount]]
        : [],
    };
  }

  const { totalDepositedKeys = 0, enqueuedCount = 0 } = operatorInfo;

  const { priority, maxDeposits, lowestPriority } = queueConfig;

  // Calculate available priority slots
  const depositedAndQueued = totalDepositedKeys + enqueuedCount;
  const priorityDepositsLeft = Math.max(0, maxDeposits - depositedAndQueued);

  // Keys that will go to priority queue
  const keysToPriority = Math.min(submittingCount, priorityDepositsLeft);

  // Remaining keys go to general queue (lowest priority)
  const keysToLowestPriority = submittingCount - keysToPriority;

  const allocation = [
    [priority, keysToPriority],
    [lowestPriority, keysToLowestPriority],
  ].filter(([, count]) => count > 0) as [number, number][];

  return {
    keysCount: submittingCount,
    allocation,
  };
};
