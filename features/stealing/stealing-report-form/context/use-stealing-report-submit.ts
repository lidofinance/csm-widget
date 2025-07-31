import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useTxModalStagesStealingReport } from '../hooks/use-tx-modal-stages-stealing-report';
import { StealingReportFormInputType } from './types';
import { isHex } from 'viem';

type UseStealingReportOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useStealingReportSubmit = ({
  onConfirm,
  onRetry,
}: UseStealingReportOptions) => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesStealingReport();

  const stealingReport = useCallback(
    async ({
      amount,
      nodeOperatorId,
      blockhash,
    }: StealingReportFormInputType): Promise<boolean> => {
      invariant(amount !== undefined, 'Amount is not defined');
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');
      invariant(isHex(blockhash), 'BlockHash is not valid');

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ amount, nodeOperatorId, blockhash });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(
                { amount, nodeOperatorId, blockhash },
                payload.hash,
              );
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success(
                { amount, nodeOperatorId, blockhash },
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

        await csm.stealing.report({
          nodeOperatorId,
          amount,
          blockHash: blockhash,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [csm.stealing, onConfirm, txModalStages, onRetry],
  );

  return {
    stealingReport,
  };
};
