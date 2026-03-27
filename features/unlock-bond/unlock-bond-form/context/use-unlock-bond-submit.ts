import { useCallback } from 'react';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from '../context';
import { useTxModalStagesUnlockBond } from '../hooks/use-tx-modal-stages-unlock-bond';
import invariant from 'tiny-invariant';

export const useUnlockBondSubmit: FormSubmitterHook<
  UnlockBondFormInputType,
  UnlockBondFormNetworkData
> = () => {
  const { bond } = useSmSDK();
  const { txModalStages } = useTxModalStagesUnlockBond();

  return useCallback(
    async (
      { amount },
      { nodeOperatorId, isExpired },
      { onConfirm, onRetry },
    ) => {
      try {
        const callback: TransactionCallback<bigint | undefined> = async ({
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
            case TransactionCallbackStage.DONE:
              txModalStages.success(
                { lockedBond: payload.result ?? undefined },
                payload.hash,
              );
              break;
            case TransactionCallbackStage.MULTISIG_DONE:
              txModalStages.successMultisig();
              break;
            case TransactionCallbackStage.ERROR:
              txModalStages.failed(payload.error, onRetry);
              break;
            default:
          }
        };

        if (isExpired) {
          await bond.unlockExpiredLock({ nodeOperatorId, callback });
        } else {
          invariant(amount !== undefined, 'BondAmount is not defined');
          await bond.coverLockedBond({ nodeOperatorId, amount, callback });
        }

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [bond, txModalStages],
  );
};
