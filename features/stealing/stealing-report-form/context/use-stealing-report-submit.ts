import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { isHex } from 'viem';
import { useTxModalStagesStealingReport } from '../hooks/use-tx-modal-stages-stealing-report';
import {
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from './types';

export const useStealingReportSubmit: FormSubmitterHook<
  StealingReportFormInputType,
  StealingReportFormNetworkData
> = () => {
  const { stealing } = useSmSDK();
  const { txModalStages } = useTxModalStagesStealingReport();

  return useCallback(
    async (
      { amount, nodeOperatorId, penaltyType, details },
      _data,
      { onConfirm, onRetry },
    ) => {
      invariant(amount !== undefined, 'Amount is not defined');
      invariant(nodeOperatorId !== undefined, 'NodeOperatorId is not defined');
      invariant(isHex(penaltyType), 'PenaltyType is not valid');

      try {
        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign({ amount, nodeOperatorId });
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending({ amount, nodeOperatorId }, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success({ amount, nodeOperatorId }, payload.hash);
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

        await stealing.report({
          nodeOperatorId,
          amount,
          penaltyType,
          details: details || '',
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [stealing, txModalStages],
  );
};
