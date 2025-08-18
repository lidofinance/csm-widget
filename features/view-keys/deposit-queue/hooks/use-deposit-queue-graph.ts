import { useMemo } from 'react';
import type { UseDepositQueueGraphResult } from './enhanced-types';
import { createMultiQueueVisualization } from './use-multi-queue';
import { isMultiQueue, useQueueData } from './use-queue-data';
import { createSingleQueueVisualization } from './use-single-queue';

export const useDepositQueueGraph = (
  fullView = false,
): UseDepositQueueGraphResult => {
  const {
    shareLimit,
    queueAnalysis,
    operatorInfo,
    submittingCount,
    isLoading,
  } = useQueueData();

  return useMemo((): UseDepositQueueGraphResult => {
    if (isLoading || !shareLimit) {
      return { isLoading: true };
    }

    const data = isMultiQueue(queueAnalysis)
      ? createMultiQueueVisualization(
          operatorInfo,
          queueAnalysis,
          shareLimit,
          submittingCount,
          fullView,
        )
      : createSingleQueueVisualization(shareLimit, submittingCount, fullView);

    return {
      isLoading: false,
      data,
    };
  }, [
    isLoading,
    shareLimit,
    queueAnalysis,
    operatorInfo,
    submittingCount,
    fullView,
  ]);
};
