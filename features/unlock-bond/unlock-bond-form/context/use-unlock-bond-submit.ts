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

export const useUnlockBondSubmit: FormSubmitterHook<
  UnlockBondFormInputType,
  UnlockBondFormNetworkData
> = () => {
  const { bond: bondSDK } = useSmSDK();
  const { txModalStages } = useTxModalStagesUnlockBond();

  return useCallback(
    async (
      _,
      { nodeOperatorId, isExpired, compensationAmount },
      { onConfirm, onRetry },
    ) => {
      try {
        const callback: TransactionCallback<bigint | undefined> = async ({
          stage,
          payload,
        }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ compensationAmount });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ compensationAmount }, payload.hash);
              break;
            case TransactionCallbackStage.DONE:
              txModalStages.success(
                {
                  lockedBond: payload.result ?? undefined,
                  compensationAmount,
                },
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
          await bondSDK.unlockExpiredLock({ nodeOperatorId, callback });
        } else {
          await bondSDK.compensateLockedBond({ nodeOperatorId, callback });
        }

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [bondSDK, txModalStages],
  );
};
