import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useTxModalStagesEnableTopUpAllocation } from '../hooks/use-tx-modal-stages-enable-top-up-allocation';
import {
  EnableTopUpAllocationFormInputType,
  EnableTopUpAllocationFormNetworkData,
} from './types';

export type EnableTopUpAllocationFlow = { action: 'enable' } & Executable;

export const useEnableTopUpAllocationFlowResolver = (): FlowResolver<
  EnableTopUpAllocationFormInputType,
  EnableTopUpAllocationFormNetworkData,
  EnableTopUpAllocationFlow
> => {
  const cmSdk = useSmSDK(MODULE_NAME.CM);
  const buildCallback = useTxModalStagesEnableTopUpAllocation();

  return useCallback(
    (input, data) => ({
      action: 'enable' as const,
      submit: () => {
        invariant(cmSdk, 'CM SDK is not defined');
        invariant(
          input.nodeOperatorId !== undefined,
          'NodeOperatorId is not defined',
        );

        return cmSdk.metaRegistry.enableTopUpAllocation({
          nodeOperatorId: input.nodeOperatorId,
          callback: buildCallback(input, data),
        });
      },
    }),
    [cmSdk, buildCallback],
  );
};
