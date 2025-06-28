import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useConfirmEjectKeysModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesEjectKeys } from '../hooks/use-tx-modal-stages-eject-keys';
import { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';

type EjectKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useEjectKeysSubmit = ({
  onConfirm,
  onRetry,
}: EjectKeysOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesEjectKeys();
  const confirm = useConfirmEjectKeysModal();

  return useCallback(
    async (
      { selection: { start, count } }: EjectKeysFormInputType,
      {
        nodeOperatorId,
        info,
        keys,
        withdrawalRequestFee: amount,
      }: EjectKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(keys, 'Keys are not defined');
      invariant(amount, 'Amount is not defined');
      invariant(
        info?.totalDepositedKeys !== undefined,
        'Offset is not defined',
      );

      const startIndex = info.totalDepositedKeys + start; // FIXME: offset? ??
      const keysCount = count;

      if (!(await confirm({}))) {
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

        await csm.keys.ejectKeys({
          nodeOperatorId,
          startIndex: BigInt(startIndex),
          keysCount: BigInt(keysCount),
          amount,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [confirm, csm.keys, onConfirm, txModalStages, onRetry],
  );
};
