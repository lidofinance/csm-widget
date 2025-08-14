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
      { selection }: EjectKeysFormInputType,
      {
        nodeOperatorId,
        info,
        keys,
        withdrawalRequestFee: amount,
      }: EjectKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');
      invariant(keys?.length, 'Keys are not defined');
      invariant(amount !== undefined, 'Amount is not defined');
      invariant(
        info?.totalDepositedKeys !== undefined,
        'Offset is not defined',
      );

      if (!(await confirm({}))) {
        return false;
      }

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ keysCount: selection.length });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(
                { keysCount: selection.length },
                payload.hash,
              );
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success(
                { keysCount: selection.length },
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

        await csm.keys.ejectKeysByArray({
          nodeOperatorId,
          keyIndices: selection.map((v) => BigInt(v)),
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
