import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { HIGH_EJECTION_COST_THRESHOLD } from 'consts';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useConfirmHighCostModal } from '../hooks/use-confirm-high-cost-modal';
import { useConfirmEjectKeysModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesEjectKeys } from '../hooks/use-tx-modal-stages-eject-keys';
import { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';

export const useEjectKeysSubmit: FormSubmitterHook<
  EjectKeysFormInputType,
  EjectKeysFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesEjectKeys();
  const confirm = useConfirmEjectKeysModal();
  const confirmHighCost = useConfirmHighCostModal();

  return useCallback(
    async (
      { selection, feeAmount },
      { nodeOperatorId, ejectKeyFee },
      { onConfirm, onRetry },
    ) => {
      invariant(feeAmount !== undefined, 'Fee amount is not defined');

      if (
        ejectKeyFee >= HIGH_EJECTION_COST_THRESHOLD &&
        !(await confirmHighCost({}))
      ) {
        return false;
      }

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
          amount: feeAmount,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [confirm, confirmHighCost, csm.keys, txModalStages],
  );
};
