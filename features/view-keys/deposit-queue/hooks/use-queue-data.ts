import {
  useCurveParameters,
  useDepositQueueBatches,
  useNodeOperatorId,
  useOperatorInfo,
  useShareLimit,
} from 'modules/web3';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { calculateAndSelectByOperator } from './calculate-and-select-by-operator';
import type {
  ShareLimit,
  OperatorInfo,
  SubmittingAllocation,
} from './enhanced-types';
import type { DepositQueueAnalysis } from './calculate-and-select-by-operator';
import { useCurrentCurveId } from 'shared/hooks';
import { calculatePriorityPlacement } from './calculate-priority-placement';

export interface QueueDataResult {
  nodeOperatorId: bigint | undefined;
  operatorInfo: OperatorInfo | undefined;
  shareLimit: ShareLimit | undefined;
  queueAnalysis: DepositQueueAnalysis | undefined;
  submittingAllocation: SubmittingAllocation | undefined;
  isLoading: boolean;
}

export const useQueueData = (): QueueDataResult => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorInfo } = useOperatorInfo(nodeOperatorId);
  const { data: shareLimit } = useShareLimit();
  const { data: queueAnalysis } = useDepositQueueBatches(
    calculateAndSelectByOperator(nodeOperatorId),
  );

  const curveId = useCurrentCurveId();
  const { data: queueConfig } = useCurveParameters(
    curveId,
    (params) => params.queueConfig,
  );

  const form = useFormContext<DepositDataInputType>();
  const submittingCount = form?.getValues('depositData')?.length;

  const submittingAllocation = calculatePriorityPlacement(
    operatorInfo,
    queueConfig,
    submittingCount,
  );

  return {
    nodeOperatorId,
    operatorInfo,
    shareLimit,
    queueAnalysis,
    submittingAllocation,
    isLoading: !shareLimit,
  };
};

export const isMultiQueue = (
  queueAnalysis: DepositQueueAnalysis | undefined,
): queueAnalysis is DepositQueueAnalysis => {
  return Boolean(
    queueAnalysis &&
      queueAnalysis.queueAnalysis &&
      queueAnalysis.queueAnalysis.some((q) => q.totalKeysInQueue > 0n),
  );
};
