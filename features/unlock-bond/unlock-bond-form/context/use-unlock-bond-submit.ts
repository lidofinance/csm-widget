import { useCallback } from 'react';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from '../context';
import { useTxModalStagesUnlockBond } from '../hooks/use-tx-modal-stages-unlock-bond';

export const useUnlockBondSubmit: FormSubmitterHook<
  UnlockBondFormInputType,
  UnlockBondFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesUnlockBond();

  return useCallback(
    async ({ amount }, { nodeOperatorId }, { onConfirm, onRetry }) => {
      if (amount === undefined) {
        throw new Error('BondAmount is not defined');
      }

      try {
        const callback: TransactionCallback<bigint> = async ({
          stage,
          payload,
        }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ amount });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ amount }, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              payload;
              txModalStages.success(
                { lockedBond: payload.result },
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

        await csm.bond.coverLockedBond({
          nodeOperatorId,
          amount,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.bond, txModalStages],
  );
};
