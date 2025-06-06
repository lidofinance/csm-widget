import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { handleTxError } from 'shared/transaction-modal';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from '../context';
import { useTxModalStagesClaimBond } from '../hooks/use-tx-modal-stages-claim-bond';

type UseClaimBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useClaimBondSubmit = ({
  onConfirm,
  onRetry,
}: UseClaimBondOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesClaimBond();

  const claimBond = useCallback(
    async (
      { amount = 0n, token, claimRewards }: ClaimBondFormInputType,
      { nodeOperatorId, rewards }: ClaimBondFormNetworkData,
    ): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(
        (claimRewards && rewards) || !claimRewards,
        'Rewards is not defined',
      );

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
    [csm.bond, txModalStages, onConfirm, onRetry],
  );

  return {
    claimBond,
  };
};
