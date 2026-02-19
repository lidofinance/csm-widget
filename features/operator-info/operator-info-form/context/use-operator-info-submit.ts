import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { MODULE } from 'consts';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import type {
  OperatorInfoFormInputType,
  OperatorInfoFormNetworkData,
} from './types';
import { useTxModalStagesOperatorInfo } from '../hooks/use-tx-modal-stages-operator-info';

export const useOperatorInfoSubmit: FormSubmitterHook<
  OperatorInfoFormInputType,
  OperatorInfoFormNetworkData
> = () => {
  const sdk = useSmSDK(MODULE.CM);
  const { txModalStages } = useTxModalStagesOperatorInfo();

  return useCallback(
    async (
      { name, description },
      { nodeOperatorId },
      { onConfirm, onRetry },
    ) => {
      if (!sdk) throw new Error('CM SDK is not available');

      try {
        const callback: TransactionCallback<undefined> = async ({
          stage,
          payload,
        }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign();
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(payload.hash);
              break;
            case TransactionCallbackStage.DONE:
              txModalStages.success(payload.hash);
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

        await sdk.metaRegistry.setOperatorInfo({
          nodeOperatorId,
          name,
          description,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [sdk, txModalStages],
  );
};
