import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import {
  AddBondResult,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { handleTxError } from 'shared/transaction-modal';
import { AddBondFormInputType, AddBondFormNetworkData } from '../context';
import { useTxModalStagesAddBond } from '../hooks/use-tx-modal-stages-add-bond';

type UseAddBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useAddBondSubmit = ({ onConfirm, onRetry }: UseAddBondOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesAddBond();

  const addBond = useCallback(
    async (
      { bondAmount: amount, token }: AddBondFormInputType,
      { nodeOperatorId }: AddBondFormNetworkData,
    ): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');

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
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.bond, onConfirm, txModalStages, onRetry],
  );

  return {
    addBond,
  };
};
