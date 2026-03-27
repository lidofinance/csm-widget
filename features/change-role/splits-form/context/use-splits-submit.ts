import {
  FeeSplit,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { useConfirmSplitsModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSplits } from '../hooks/use-tx-modal-stages-splits';
import { SplitsFormInputType, SplitsFormNetworkData } from './types';

// eslint-disable-next-line func-style
function assertFeeSplits(
  splits: Partial<FeeSplit>[],
): asserts splits is FeeSplit[] {
  invariant(
    splits.every((s) => !!s.share && !!s.recipient),
    'All splits must have address and share defined',
  );
}

export const useSplitsSubmit: FormSubmitterHook<
  SplitsFormInputType,
  SplitsFormNetworkData
> = () => {
  const sdk = useSmSDK();
  const { txModalStages } = useTxModalStagesSplits();
  const confirmSplits = useConfirmSplitsModal();

  return useCallback(
    async (
      { feeSplits },
      { nodeOperatorId, rewards },
      { onConfirm, onRetry },
    ) => {
      invariant(rewards, 'Rewards data is required for submitting splits');
      assertFeeSplits(feeSplits);

      const confirmed = await confirmSplits({ feeSplits });
      if (!confirmed) return false;

      try {
        const props = { feeSplits };
        const { shares, proof } = rewards;

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

        await sdk.roles.setFeeSplits({
          nodeOperatorId,
          feeSplits,
          shares,
          proof,
          callback,
        });

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [sdk, txModalStages, confirmSplits],
  );
};
