import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { useTxModalStagesClaimBond } from '../hooks/use-tx-modal-stages-claim-bond';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from './types';

export const useClaimBondSubmit: FormSubmitterHook<
  ClaimBondFormInputType,
  ClaimBondFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesClaimBond();

  return useCallback(
    async (
      { amount = 0n, token, claimRewards },
      { nodeOperatorId, rewards },
      { onConfirm, onRetry },
    ) => {
      try {
        const args = {
          amount,
          token,
          claimRewards,
          rewards: rewards?.available,
        };

        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(args);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(args, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success(args, payload.hash);
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

        await csm.bond.claimBond({
          nodeOperatorId,
          token,
          amount,
          proof: rewards?.proof,
          shares: rewards?.shares,
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
