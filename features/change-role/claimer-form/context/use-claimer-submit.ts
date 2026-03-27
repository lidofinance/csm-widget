import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { zeroAddress } from 'viem';
import { ClaimerFormInputType, ClaimerFormNetworkData } from './types';
import { useTxModalStagesClaimer } from '../hooks/use-tx-modal-stages-claimer';

export const useClaimerSubmit: FormSubmitterHook<
  ClaimerFormInputType,
  ClaimerFormNetworkData
> = () => {
  const sdk = useSmSDK();
  const { txModalStages } = useTxModalStagesClaimer();

  return useCallback(
    async (
      { address: addressRaw, isUnset },
      { nodeOperatorId },
      { onConfirm, onRetry },
    ) => {
      const claimerAddress = isUnset
        ? zeroAddress
        : (addressRaw ?? zeroAddress);

      try {
        const props = { claimerAddress, isUnset };

        const callback: TransactionCallback<undefined> = async ({
          stage,
          payload,
        }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(props);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(props, payload.hash);
              break;
            case TransactionCallbackStage.DONE:
              txModalStages.success(props, payload.hash);
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

        await sdk.roles.setCustomRewardsClaimer({
          nodeOperatorId,
          claimerAddress,
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
