import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { useKeysCache } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
import { RemoveKeysFormInputType, RemoveKeysFormNetworkData } from './types';

type RemoveKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useRemoveKeysSubmit = ({
  onConfirm,
  onRetry,
}: RemoveKeysOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesRemoveKeys();
  const { removeCachePubkeys } = useKeysCache();

  return useCallback(
    async (
      { selection: { start, count } }: RemoveKeysFormInputType,
      { nodeOperatorId, info, keys }: RemoveKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');
      invariant(keys?.length, 'Keys are not defined');
      invariant(
        info?.totalDepositedKeys !== undefined,
        'Offset is not defined',
      );

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
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.keys, onConfirm, removeCachePubkeys, txModalStages, onRetry],
  );
};
