import {
  MAX_EFFECTIVE_BALANCE_WC_TYPE_01_WEI,
  MODULE_NAME,
  ShareLimitInfo,
} from '@lidofinance/lido-csm-sdk';
import {
  useCurveParameters,
  useDepositQueueBatches,
  useModule,
  useNodeOperatorId,
  useOperatorInfo,
  useShareLimit,
} from 'modules/web3';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
import { QueueUnit } from '../types';
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
  unit: QueueUnit;
  scale: bigint;
  isLoading: boolean;
};

const toShareLimit = (data: ShareLimitInfo, unit: QueueUnit): ShareLimit =>
  unit === 'eth'
    ? {
        active: data.activeWei,
        activeLeft: data.activeLeftWei,
        capacity: data.capacityWei,
        queue: data.queueWei,
      }
    : {
        active: data.active,
        activeLeft: data.activeLeft,
        capacity: data.capacity,
        queue: data.queue,
      };

export const useQueueData = (module?: MODULE_NAME): QueueDataResult => {
  const { module: activeModule } = useModule();
  const targetModule = useDepositQueueModule(module);
  const activeOperatorId = useNodeOperatorId();
  // Only the active module has an active operator; a different target module
  // must behave like a first-time creator with no operator.
  const nodeOperatorId =
    targetModule === activeModule ? activeOperatorId : undefined;

  const unit: QueueUnit = targetModule === MODULE_NAME.CSM_02 ? 'eth' : 'keys';
  const scale = unit === 'eth' ? MAX_EFFECTIVE_BALANCE_WC_TYPE_01_WEI : 1n;

  const { data: operatorInfo } = useOperatorInfo(nodeOperatorId);
  const { data: shareLimitInfo } = useShareLimit(undefined, targetModule);
  const shareLimit = useMemo(
    () => shareLimitInfo && toShareLimit(shareLimitInfo, unit),
    [shareLimitInfo, unit],
  );
  // query select is only reused across renders when its reference is stable
  const selectByOperator = useMemo(
    () => calculateAndSelectByOperator(nodeOperatorId, scale),
    [nodeOperatorId, scale],
  );
  const { data: queueAnalysis } = useDepositQueueBatches(
    selectByOperator,
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

  const submittingAllocation: SubmittingAllocation | undefined = useMemo(() => {
    const placement = calculatePriorityPlacement(
      operatorInfo,
      queueConfig,
      submittingCount,
    );
    return (
      placement && {
        amount: placement.keysCount * scale,
        allocation: placement.allocation.map(
          ([priority, keysCount]): [number, bigint] => [
            priority,
            keysCount * scale,
          ],
        ),
      }
    );
  }, [operatorInfo, queueConfig, submittingCount, scale]);

  return {
    nodeOperatorId,
    operatorInfo,
    shareLimit,
    queueAnalysis,
    submittingAllocation,
    unit,
    scale,
    isLoading: !shareLimit,
  };
};

export const isMultiQueue = (
  queueAnalysis: DepositQueueAnalysis | undefined,
): queueAnalysis is DepositQueueAnalysis => {
  return Boolean(
    queueAnalysis &&
    queueAnalysis.queueAnalysis &&
    queueAnalysis.queueAnalysis.some((q) => q.totalAmountInQueue > 0n),
  );
};
