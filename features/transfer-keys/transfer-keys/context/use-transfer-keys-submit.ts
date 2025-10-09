import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesTransferKeys } from '../hooks/use-tx-modal-stages-transfer-keys';
import {
  TransferKeysFormInputType,
  TransferKeysFormNetworkData,
} from './types';
import { useConfirmCleanupModal } from '../hooks/use-confirm-cleanup-modal';

type TransferKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useTransferKeysSubmit = ({
  onConfirm,
  onRetry,
}: TransferKeysOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesTransferKeys();
  const confirm = useConfirmCleanupModal();

  return useCallback(
    async (
      _: TransferKeysFormInputType,
      {
        nodeOperatorId,
        keysToMigrate: keysCount,
        info,
        needCleanup,
      }: TransferKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');
      invariant(keysCount, 'No keys to transfer');
      invariant(info, 'Node operator info is not defined');

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

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [confirm, csm.keys, csm.depositQueue, onConfirm, txModalStages, onRetry],
  );
};
