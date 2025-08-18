import {
  useDepositQueueBatches,
  useNodeOperatorId,
  useOperatorInfo,
  useShareLimit,
} from 'modules/web3';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { calculateAndSelectByOperator } from './calculate-and-select-by-operator';
import type { ShareLimit, OperatorInfo } from './enhanced-types';
import type { DepositQueueAnalysis } from './calculate-and-select-by-operator';

export interface QueueDataResult {
  nodeOperatorId: bigint | undefined;
  operatorInfo: OperatorInfo | undefined;
  shareLimit: ShareLimit | undefined;
  queueAnalysis: DepositQueueAnalysis | undefined;
  submittingCount: number | undefined;
  isLoading: boolean;
}

export const useQueueData = (): QueueDataResult => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorInfo } = useOperatorInfo(nodeOperatorId);
  const { data: shareLimit } = useShareLimit();
  const { data: queueAnalysis } = useDepositQueueBatches(
    calculateAndSelectByOperator(nodeOperatorId),
  );

  const form = useFormContext<DepositDataInputType>();
  const submittingCount = form?.getValues('depositData')?.length;

  return {
    nodeOperatorId,
    operatorInfo,
    shareLimit,
    queueAnalysis,
    submittingCount,
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
