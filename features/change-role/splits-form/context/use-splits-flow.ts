import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useConfirmSplitsModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSplits } from '../hooks/use-tx-modal-stages-splits';
import { useSplitsFormData } from './splits-data-provider';
import { SplitsFormInputType, SplitsFormNetworkData } from './types';

export type SplitsFlow =
  | { action: 'view' }
  | ({ action: 'set-splits' } & Executable);

// eslint-disable-next-line func-style
function assertFeeSplits(
  splits: Partial<FeeSplit>[],
): asserts splits is FeeSplit[] {
  invariant(
    splits.every((s) => !!s.share && !!s.recipient),
    'All splits must have address and share defined',
  );
}

export const useSplitsFlowResolver = (): FlowResolver<
  SplitsFormInputType,
  SplitsFormNetworkData,
  SplitsFlow
> => {
  const sdk = useSmSDK();
  const confirmSplits = useConfirmSplitsModal();
  const buildCallback = useTxModalStagesSplits();

  return useCallback(
    (input, data) => {
      if (!data.canEdit) return { action: 'view' };

      return {
        action: 'set-splits' as const,
        confirm: async () => {
          assertFeeSplits(input.feeSplits);
          return confirmSplits({ feeSplits: input.feeSplits });
        },
        submit: (onRetry) => {
          assertFeeSplits(input.feeSplits);
          invariant(
            data.rewards,
            'Rewards data is required for submitting splits',
          );
          const { shares, proof } = data.rewards;

          return sdk.roles.setFeeSplits({
            nodeOperatorId: data.nodeOperatorId,
            feeSplits: input.feeSplits,
            shares,
            proof,
            callback: buildCallback(input, data, onRetry),
          });
        },
      };
    },
    [sdk, confirmSplits, buildCallback],
  );
};

export const useSplitsFlow = (): SplitsFlow => {
  const resolve = useSplitsFlowResolver();
  const data = useSplitsFormData(true);
  return resolve({} as SplitsFormInputType, data);
};
