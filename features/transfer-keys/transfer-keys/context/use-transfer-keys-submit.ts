import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { useConfirmCleanupModal } from '../hooks/use-confirm-cleanup-modal';
import { useTxModalStagesTransferKeys } from '../hooks/use-tx-modal-stages-transfer-keys';
import {
  TransferKeysFormInputType,
  TransferKeysFormNetworkData,
} from './types';

export const useTransferKeysSubmit: FormSubmitterHook<
  TransferKeysFormInputType,
  TransferKeysFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesTransferKeys();
  const confirm = useConfirmCleanupModal();

  return useCallback(
    async (_: TransferKeysFormInputType, data, { onConfirm, onRetry }) => {
      const { nodeOperatorId, keysToMigrate: keysCount, needCleanup } = data;

      if (needCleanup && !(await confirm({}))) {
        return false;
      }

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ keysCount });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ keysCount }, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success({ keysCount }, payload.hash);
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

        await csm.keys.migrateToPriorityQueue({
          nodeOperatorId,
          callback,
        });

        const promise = onConfirm?.();

        if (needCleanup) {
          const callback: TransactionCallback = async ({ stage, payload }) => {
            switch (stage) {
              case TransactionCallbackStage.SIGN:
                txModalStages.signCleanup();
                break;
              case TransactionCallbackStage.RECEIPT:
                txModalStages.pendingCleanup(payload.hash);
                break;
              case TransactionCallbackStage.DONE: {
                txModalStages.successCleanup({ keysCount }, payload.hash);
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

          await csm.depositQueue.clean({ callback });
        }

        await promise;

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [confirm, csm.keys, csm.depositQueue, txModalStages],
  );
};
