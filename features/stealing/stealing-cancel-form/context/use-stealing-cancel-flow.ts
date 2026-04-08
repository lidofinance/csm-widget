import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useTxModalStagesStealingCancel } from '../hooks/use-tx-modal-stages-stealing-cancel';
import {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from './types';

export type StealingCancelFlow = { action: 'cancel' } & Executable;

export const useStealingCancelFlowResolver = (): FlowResolver<
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
  StealingCancelFlow
> => {
  const { stealing } = useSmSDK();
  const buildCallback = useTxModalStagesStealingCancel();

  return useCallback(
    (input, data) => ({
      action: 'cancel' as const,
      submit: (onRetry) => {
        invariant(input.amount !== undefined, 'Amount is not defined');
        invariant(
          input.nodeOperatorId !== undefined,
          'NodeOperatorId is not defined',
        );

        return stealing.cancel({
          nodeOperatorId: input.nodeOperatorId,
          amount: input.amount,
          callback: buildCallback(input, data, onRetry),
        });
      },
    }),
    [stealing, buildCallback],
  );
};
