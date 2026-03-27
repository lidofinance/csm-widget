import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesStealingCancel } from '../hooks/use-tx-modal-stages-stealing-cancel';
import {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from './types';

export const useStealingCancelSubmit: FormSubmitterHook<
  StealingCancelFormInputType,
  StealingCancelFormNetworkData
> = () => {
  const { stealing } = useSmSDK();
  const { txModalStages } = useTxModalStagesStealingCancel();

  return useCallback(
    async ({ amount, nodeOperatorId }, _data, { onConfirm, onRetry }) => {
      invariant(amount !== undefined, 'Amount is not defined');
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ amount, nodeOperatorId });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ amount, nodeOperatorId }, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success({ amount, nodeOperatorId }, payload.hash);
              break;
            }
            case TransactionCallbackStage.MULTISIG_DONE:
              txModalStages.successMultisig();
              break;
            case TransactionCallbackStage.ERROR:
              txModalStages.failed(payload.error, onRetry);
              break;
            default:
          }
        };

        await stealing.cancel({
          nodeOperatorId,
          amount,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [stealing, txModalStages],
  );
};
