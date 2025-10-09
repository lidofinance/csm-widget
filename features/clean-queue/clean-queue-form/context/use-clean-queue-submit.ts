import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import { useTxModalStagesCleanQueue } from '../hooks/use-tx-modal-stages-clean-queue';
import { CleanQueueFormInputType, CleanQueueFormNetworkData } from './types';

type UseCleanQueueOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useCleanQueueSubmit = ({
  onConfirm,
  onRetry,
}: UseCleanQueueOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesCleanQueue();

  const cleanQueue = useCallback(
    async (
      _: CleanQueueFormInputType,
      __: CleanQueueFormNetworkData,
    ): Promise<boolean> => {
      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign();
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success(payload.hash);
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

        await csm.depositQueue.clean({
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.depositQueue, onConfirm, txModalStages, onRetry],
  );

  return {
    cleanQueue,
  };
};
