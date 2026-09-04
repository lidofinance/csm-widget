import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { type CsmFamilySDK, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useTxModalStagesNormalizeQueue } from '../hooks/use-tx-modal-stages-normalize-queue';
import { useNormalizeQueueFormData } from './normalize-queue-data-provider';
import {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from './types';

export type NormalizeQueueFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'nothing' }
  | ({ action: 'normalize' } & Executable);

export const useNormalizeQueueFlowResolver = (): FlowResolver<
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
  NormalizeQueueFlow
> => {
  const sdk = useSmSDK() as CsmFamilySDK;
  const [canNormalize, access] = useCanPerform(sdk.depositQueue, 'normalize');
  const buildCallback = useTxModalStagesNormalizeQueue();

  return useCallback(
    (input, data) => {
      if (!canNormalize) return { action: 'no-access', access };
      if (data.unqueuedCount === 0) return { action: 'nothing' };

      return {
        action: 'normalize' as const,
        submit: () =>
          sdk.depositQueue.normalize({
            nodeOperatorId: data.nodeOperatorId,
            callback: buildCallback(input, data),
          }),
      };
    },
    [sdk.depositQueue, canNormalize, access, buildCallback],
  );
};

export const useNormalizeQueueFlow = (): NormalizeQueueFlow => {
  const resolve = useNormalizeQueueFlowResolver();
  const data = useNormalizeQueueFormData(true);
  return resolve({} as NormalizeQueueFormInputType, data);
};
