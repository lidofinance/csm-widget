import { type MethodAccess, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useActiveSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { useConfirmDisableTopUpModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesTopUpAllocation } from '../hooks/use-tx-modal-stages-top-up-allocation';
import { useTopUpAllocationFormData } from './top-up-allocation-data-provider';
import type {
  TopUpAllocationFormInputType,
  TopUpAllocationFormNetworkData,
} from './types';

export type TopUpAllocationFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'locked' }
  | ({ action: 'disable' } & Executable);

export const useTopUpAllocationFlowResolver = (): FlowResolver<
  TopUpAllocationFormInputType,
  TopUpAllocationFormNetworkData,
  TopUpAllocationFlow
> => {
  const sdk = useActiveSmSDK(MODULE_NAME.CM);
  invariant(sdk, 'CM SDK is required');
  const [canDisable, disableAccess] = useCanPerform(
    sdk.metaRegistry,
    'disableTopUpAllocation',
  );
  const confirmModal = useConfirmDisableTopUpModal();
  const buildCallback = useTxModalStagesTopUpAllocation();

  // Disabling is the only action, so the submitted value is not inspected
  return useCallback(
    (input, data) => {
      if (!canDisable) return { action: 'no-access', access: disableAccess };
      if (!data.enabled) return { action: 'locked' };

      return {
        action: 'disable' as const,
        confirm: () => confirmModal({}),
        submit: () =>
          sdk.metaRegistry.disableTopUpAllocation({
            nodeOperatorId: data.nodeOperatorId,
            callback: buildCallback(input, data),
          }),
      };
    },
    [sdk.metaRegistry, canDisable, disableAccess, confirmModal, buildCallback],
  );
};

export const useTopUpAllocationFlow = (): TopUpAllocationFlow => {
  const resolve = useTopUpAllocationFlowResolver();
  const data = useTopUpAllocationFormData(true);
  return resolve({} as TopUpAllocationFormInputType, data);
};
