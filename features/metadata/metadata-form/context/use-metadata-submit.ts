import {
  TransactionCallback,
  TransactionCallbackStage,
  MODULE_NAME,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';
import { useTxModalStagesMetadata } from '../hooks/use-tx-modal-stages-metadata';

export const useMetadataSubmit: FormSubmitterHook<
  MetadataFormInputType,
  MetadataFormNetworkData
> = () => {
  const sdk = useSmSDK(MODULE_NAME.CM);
  const { txModalStages } = useTxModalStagesMetadata();

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
