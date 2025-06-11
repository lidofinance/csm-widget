import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { handleTxError } from 'shared/transaction-modal';
import { ClaimTypeFormInputType, ClaimTypeFormNetworkData } from '.';
import { useTxModalStagesClaimType } from '../hooks/use-tx-modal-stages-claim-type';

type UseClaimTypeOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useClaimTypeSubmit = ({
  onConfirm,
  onRetry,
}: UseClaimTypeOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesClaimType();

  const claimType = useCallback(
    async (
      _: ClaimTypeFormInputType,
      { nodeOperatorId, proof, curveId }: ClaimTypeFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(proof?.proof, 'proof is not defined');
      invariant(curveId, 'curveId is not defined');

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ curveId });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ curveId }, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              payload;
              txModalStages.success({ curveId }, payload.hash);
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
    [csm.icsGate, onConfirm, txModalStages, onRetry],
  );

  return {
    claimType,
  };
};
