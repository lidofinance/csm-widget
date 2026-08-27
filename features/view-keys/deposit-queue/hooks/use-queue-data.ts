import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  useCurveParameters,
  useDepositQueueBatches,
  useModule,
  useNodeOperatorId,
  useOperatorInfo,
  useShareLimit,
} from 'modules/web3';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
import { calculateAndSelectByOperator } from './calculate-and-select-by-operator';
import type {
  ShareLimit,
  OperatorInfo,
  SubmittingAllocation,
} from './enhanced-types';
import type { DepositQueueAnalysis } from './calculate-and-select-by-operator';
import { useCurrentCurveId } from 'shared/hooks';
import { calculatePriorityPlacement } from './calculate-priority-placement';
import { useDepositQueueModule } from './use-deposit-queue-module';

export type QueueDataResult = {
  nodeOperatorId: bigint | undefined;
  operatorInfo: OperatorInfo | undefined;
  shareLimit: ShareLimit | undefined;
  queueAnalysis: DepositQueueAnalysis | undefined;
  submittingAllocation: SubmittingAllocation | undefined;
  isLoading: boolean;
};

export const useQueueData = (module?: MODULE_NAME): QueueDataResult => {
  const { module: activeModule } = useModule();
  const targetModule = useDepositQueueModule(module);
  const activeOperatorId = useNodeOperatorId();
  // Only the active module has an active operator; a different target module
  // must behave like a first-time creator with no operator.
  const nodeOperatorId =
    targetModule === activeModule ? activeOperatorId : undefined;

  const { data: operatorInfo } = useOperatorInfo(nodeOperatorId);
  const { data: shareLimit } = useShareLimit(undefined, targetModule);
  const { data: queueAnalysis } = useDepositQueueBatches(
    calculateAndSelectByOperator(nodeOperatorId),
    targetModule,
  );

  const curveId = useCurrentCurveId(targetModule);
  const { data: queueConfig } = useCurveParameters(
    curveId,
    (params) => params.queueConfig,
    targetModule,
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
