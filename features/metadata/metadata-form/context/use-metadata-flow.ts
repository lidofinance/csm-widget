import { type MethodAccess, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { useTxModalStagesMetadata } from '../hooks/use-tx-modal-stages-metadata';
import { useMetadataFormData } from './metadata-data-provider';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';

export type MetadataFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'restricted' }
  | ({ action: 'update' } & Executable);

export const useMetadataFlowResolver = (): FlowResolver<
  MetadataFormInputType,
  MetadataFormNetworkData,
  MetadataFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CM);
  invariant(sdk, 'CM SDK is required');
  const [canUpdate, updateAccess] = useCanPerform(
    sdk.metaRegistry,
    'setOperatorInfo',
  );
  const buildCallback = useTxModalStagesMetadata();

  return useCallback(
    (input, data) => {
      if (!canUpdate) return { action: 'no-access', access: updateAccess };
      if (data.ownerEditsRestricted) return { action: 'restricted' };

      return {
        action: 'update' as const,
        submit: (onRetry) =>
          sdk.metaRegistry.setOperatorInfo({
            nodeOperatorId: data.nodeOperatorId,
            name: input.name,
            description: input.description,
            callback: buildCallback(input, data, onRetry),
          }),
      };
    },
    [sdk.metaRegistry, canUpdate, updateAccess, buildCallback],
  );
};

export const useMetadataFlow = (): MetadataFlow => {
  const resolve = useMetadataFlowResolver();
  const data = useMetadataFormData(true);
  return resolve({} as MetadataFormInputType, data);
};
