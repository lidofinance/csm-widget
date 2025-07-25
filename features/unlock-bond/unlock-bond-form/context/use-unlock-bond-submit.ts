import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { handleTxError } from 'shared/transaction-modal';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from '../context';
import { useTxModalStagesUnlockBond } from '../hooks/use-tx-modal-stages-unlock-bond';

type UseUnlockBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useUnlockBondSubmit = ({
  onConfirm,
  onRetry,
}: UseUnlockBondOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesUnlockBond();

  const unlockBond = useCallback(
    async (
      { amount }: UnlockBondFormInputType,
      { nodeOperatorId }: UnlockBondFormNetworkData,
    ): Promise<boolean> => {
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');

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
    [csm.bond, onConfirm, txModalStages, onRetry],
  );

  return {
    unlockBond,
  };
};
