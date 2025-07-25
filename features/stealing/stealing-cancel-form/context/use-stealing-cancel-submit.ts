import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesStealingCancel } from '../hooks/use-tx-modal-stages-stealing-cancel';
import { StealingCancelFormInputType } from './types';

type UseStealingCancelOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useStealingCancelSubmit = ({
  onConfirm,
  onRetry,
}: UseStealingCancelOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesStealingCancel();

  const stealingCancel = useCallback(
    async ({
      amount,
      nodeOperatorId,
    }: StealingCancelFormInputType): Promise<boolean> => {
      invariant(amount, 'Amount is not defined');
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

        await csm.stealing.cancel({
          nodeOperatorId,
          amount,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.stealing, onConfirm, txModalStages, onRetry],
  );

  return {
    stealingCancel,
  };
};
