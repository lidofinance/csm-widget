import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { useKeysCache } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
import { RemoveKeysFormInputType, RemoveKeysFormNetworkData } from './types';

export const useRemoveKeysSubmit: FormSubmitterHook<
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesRemoveKeys();
  const { removeCachePubkeys } = useKeysCache();

  return useCallback(
    async (
      { selection: { start, count } },
      { nodeOperatorId, info, keys },
      { onConfirm, onRetry },
    ) => {
      const startIndex = info.totalDepositedKeys + start;
      const keysCount = count;

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

        await csm.keys.removeKeys({
          nodeOperatorId,
          startIndex: BigInt(startIndex),
          keysCount: BigInt(keysCount),
          callback,
        });

        await onConfirm?.();

        void removeCachePubkeys(
          keys.map(({ pubkey }) => pubkey).slice(start, start + count),
        );

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [csm.keys, removeCachePubkeys, txModalStages],
  );
};
