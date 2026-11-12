import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useTxModalStagesDelayedPenaltyCancel } from '../hooks/use-tx-modal-stages-delayed-penalty-cancel';
import {
  DelayedPenaltyCancelFormInputType,
  DelayedPenaltyCancelFormNetworkData,
} from './types';

export type DelayedPenaltyCancelFlow = { action: 'cancel' } & Executable;

export const useDelayedPenaltyCancelFlowResolver = (
  module: MODULE_NAME | undefined,
): FlowResolver<
  DelayedPenaltyCancelFormInputType,
  DelayedPenaltyCancelFormNetworkData,
  DelayedPenaltyCancelFlow
> => {
  const sdk = useSmSDK(module);
  const buildCallback = useTxModalStagesDelayedPenaltyCancel();

  return useCallback(
    (input, data) => {
      const props = () => {
        invariant(input.amount !== undefined, 'Amount is not defined');
        invariant(
          input.nodeOperatorId !== undefined,
          'NodeOperatorId is not defined',
        );
        return { nodeOperatorId: input.nodeOperatorId, amount: input.amount };
      };

      return {
        action: 'cancel' as const,
        submit: () => {
          invariant(sdk, 'Delayed penalty module is not resolved');
          return sdk.delayedPenalty.cancel({
            ...props(),
            callback: buildCallback(input, data),
          });
        },
        estimate: async () => {
          invariant(sdk, 'Delayed penalty module is not resolved');
          return sdk.delayedPenalty.estimateCancel(props());
        },
      };
    },
    [sdk, buildCallback],
  );
};
