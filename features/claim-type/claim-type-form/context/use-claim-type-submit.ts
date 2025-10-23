import { useCallback } from 'react';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { ClaimTypeFormInputType, ClaimTypeFormNetworkData } from '.';
import { useConfirmClaimTypeModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesClaimType } from '../hooks/use-tx-modal-stages-claim-type';

export const useClaimTypeSubmit: FormSubmitterHook<
  ClaimTypeFormInputType,
  ClaimTypeFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesClaimType();
  const confirmClaimtype = useConfirmClaimTypeModal();

  return useCallback(
    async (
      _: ClaimTypeFormInputType,
      { nodeOperatorId, proof },
      { onConfirm, onRetry },
    ) => {
      invariant(proof.proof, 'Proof is not defined');

      try {
        if (!(await confirmClaimtype({}))) {
          return false;
        }

        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({});
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({}, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              payload;
              txModalStages.success({}, payload.hash);
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

        await csm.icsGate.claimCurve({
          nodeOperatorId,
          proof: proof.proof,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [confirmClaimtype, csm.icsGate, txModalStages],
  );
};
