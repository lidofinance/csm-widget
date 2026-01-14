import {
  AddBondResult,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesAddBond } from '../hooks/use-tx-modal-stages-add-bond';
import { AddBondFormInputType, AddBondFormNetworkData } from './types';

export const useAddBondSubmit: FormSubmitterHook<
  AddBondFormInputType,
  AddBondFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesAddBond();

  return useCallback(
    async (
      { bondAmount: amount, token },
      { nodeOperatorId },
      { onConfirm, onRetry },
    ) => {
      invariant(amount !== undefined, 'BondAmount is not defined');

      try {
        const callback: TransactionCallback<AddBondResult> = async ({
          stage,
          payload,
        }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ amount, token });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ amount, token }, payload.hash);
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
                  balance: payload.result.current,
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

        await csm.bond.addBond({
          nodeOperatorId,
          token,
          amount,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [csm.bond, txModalStages],
  );
};
