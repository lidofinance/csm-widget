import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { toHex } from 'viem';
import { useTxModalStagesDelayedPenaltyReport } from '../hooks/use-tx-modal-stages-delayed-penalty-report';
import {
  DelayedPenaltyReportFormInputType,
  DelayedPenaltyReportFormNetworkData,
} from './types';

export type DelayedPenaltyReportFlow = { action: 'report' } & Executable;

export const useDelayedPenaltyReportFlowResolver = (): FlowResolver<
  DelayedPenaltyReportFormInputType,
  DelayedPenaltyReportFormNetworkData,
  DelayedPenaltyReportFlow
> => {
  const { delayedPenalty } = useSmSDK();
  const buildCallback = useTxModalStagesDelayedPenaltyReport();

  return useCallback(
    (input, data) => ({
      action: 'report' as const,
      submit: () => {
        invariant(input.amount !== undefined, 'Amount is not defined');
        invariant(
          input.nodeOperatorId !== undefined,
          'NodeOperatorId is not defined',
        );
        invariant(
          input.penaltyType !== undefined && input.penaltyType > 0,
          'PenaltyType is not valid',
        );

        return delayedPenalty.report({
          nodeOperatorId: input.nodeOperatorId,
          amount: input.amount,
          penaltyType: toHex(BigInt(input.penaltyType), { size: 32 }),
          details: input.details || '',
          callback: buildCallback(input, data),
        });
      },
    }),
    [delayedPenalty, buildCallback],
  );
};
