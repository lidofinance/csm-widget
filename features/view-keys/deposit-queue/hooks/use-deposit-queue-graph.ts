import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import type { UseDepositQueueGraphResult } from './enhanced-types';
import { createMultiQueueVisualization } from './use-multi-queue';
import { isMultiQueue, useQueueData } from './use-queue-data';
import { createSingleQueueVisualization } from './use-single-queue';

export const useDepositQueueGraph = (
  fullView = false,
  module?: MODULE_NAME,
): UseDepositQueueGraphResult => {
  const {
    shareLimit,
    queueAnalysis,
    submittingAllocation,
    unit,
    scale,
    isLoading,
  } = useQueueData(module);

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
          unit,
          scale,
        )
      : createSingleQueueVisualization(
          shareLimit,
          submittingAllocation,
          fullView,
          unit,
          scale,
        );

    return {
      isLoading: false,
      data,
    };
  }, [
    isLoading,
    shareLimit,
    queueAnalysis,
    submittingAllocation,
    fullView,
    unit,
    scale,
  ]);
};
