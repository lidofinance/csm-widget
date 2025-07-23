import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesNormalizeQueue } from '../hooks/use-tx-modal-stages-normalize-queue';
import {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from './types';

type UseNormalizeQueueOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useNormalizeQueueSubmit = ({
  onConfirm,
  onRetry,
}: UseNormalizeQueueOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesNormalizeQueue();

  const normalizeQueue = useCallback(
    async (
      _: NormalizeQueueFormInputType,
      { nodeOperatorId, info }: NormalizeQueueFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(info, 'Info is not defined');

      try {
        const keysCount = info.depositableValidatorsCount - info.enqueuedCount;

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

        await csm.keys.normalizeQueue({
          nodeOperatorId,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.keys, onConfirm, txModalStages, onRetry],
  );

  return {
    normalizeQueue,
  };
};
