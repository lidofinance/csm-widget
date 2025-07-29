import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { useKeysCache } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesAddKeys } from '../hooks/use-tx-modal-stages-add-keys';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

type AddKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useAddKeysSubmit = ({ onConfirm, onRetry }: AddKeysOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesAddKeys();
  const n = useNavigate();

  const { addCacheKeys } = useKeysCache();

  return useCallback(
    async (
      { depositData, token, bondAmount: amount }: AddKeysFormInputType,
      { nodeOperatorId }: AddKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(amount !== undefined, 'BondAmount is not defined');

      try {
        const keysCount = depositData.length;
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ keysCount, amount, token, nodeOperatorId });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(
                { keysCount, amount, token, nodeOperatorId },
                payload.hash,
              );
              break;
            case TransactionCallbackStage.PERMIT_SIGN:
              txModalStages.signPermit();
              break;
            case TransactionCallbackStage.APPROVE_SIGN:
              txModalStages.signApproval(payload.amount, payload.token);
              break;
            case TransactionCallbackStage.APPROVE_RECEIPT:
              txModalStages.pendingApproval(
                payload.amount,
                payload.token,
                payload.hash,
              );
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success(
                {
                  keys: depositData.map((key) => key.pubkey),
                },
                payload.hash,
              );
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

        await csm.keys.addKeys({
          nodeOperatorId,
          token,
          amount,
          depositData,
          callback,
        });

        await onConfirm?.();

        // TODO: move to onConfirm
        void addCacheKeys(depositData.map(({ pubkey }) => pubkey));

        void n(PATH.KEYS_VIEW);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.keys, onConfirm, addCacheKeys, n, txModalStages, onRetry],
  );
};
