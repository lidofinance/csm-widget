import { useMemo } from 'react';
import type { UseDepositQueueGraphResult } from './enhanced-types';
import { createMultiQueueVisualization } from './use-multi-queue';
import { isMultiQueue, useQueueData } from './use-queue-data';
import { createSingleQueueVisualization } from './use-single-queue';

export const useDepositQueueGraph = (
  fullView = false,
): UseDepositQueueGraphResult => {
  const { shareLimit, queueAnalysis, submittingAllocation, isLoading } =
    useQueueData();

  return useMemo((): UseDepositQueueGraphResult => {
    if (isLoading || !shareLimit) {
      return { isLoading: true };
    }

    const data = isMultiQueue(queueAnalysis)
      ? createMultiQueueVisualization(
          queueAnalysis,
          shareLimit,
          submittingAllocation,
          fullView,
        )
      : createSingleQueueVisualization(
          shareLimit,
          submittingAllocation,
          fullView,
        );

    return {
      isLoading: false,
      data,
    };
  }, [isLoading, shareLimit, queueAnalysis, submittingAllocation, fullView]);
};
