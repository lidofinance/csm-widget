import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { isHex } from 'viem';
import { useTxModalStagesStealingReport } from '../hooks/use-tx-modal-stages-stealing-report';
import {
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from './types';

export type StealingReportFlow = { action: 'report' } & Executable;

export const useStealingReportFlowResolver = (): FlowResolver<
  StealingReportFormInputType,
  StealingReportFormNetworkData,
  StealingReportFlow
> => {
  const { stealing } = useSmSDK();
  const buildCallback = useTxModalStagesStealingReport();

  return useCallback(
    (input, data) => ({
      action: 'report' as const,
      submit: (onRetry) => {
        invariant(input.amount !== undefined, 'Amount is not defined');
        invariant(
          input.nodeOperatorId !== undefined,
          'NodeOperatorId is not defined',
        );
        invariant(isHex(input.penaltyType), 'PenaltyType is not valid');

        return stealing.report({
          nodeOperatorId: input.nodeOperatorId,
          amount: input.amount,
          penaltyType: input.penaltyType,
          details: input.details || '',
          callback: buildCallback(input, data, onRetry),
        });
      },
    }),
    [stealing, buildCallback],
  );
};
