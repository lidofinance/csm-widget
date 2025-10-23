import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { isHex } from 'viem';
import { useTxModalStagesStealingReport } from '../hooks/use-tx-modal-stages-stealing-report';
import {
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from './types';
import invariant from 'tiny-invariant';

export const useStealingReportSubmit: FormSubmitterHook<
  StealingReportFormInputType,
  StealingReportFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { txModalStages } = useTxModalStagesStealingReport();

  return useCallback(
    async (
      { amount, nodeOperatorId, blockhash },
      _data,
      { onConfirm, onRetry },
    ) => {
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
    [csm.stealing, txModalStages],
  );
};
