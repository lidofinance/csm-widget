import { useActiveOperatorSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { getClaimerAddress } from '../claimer-state';
import { useTxModalStagesClaimer } from '../hooks/use-tx-modal-stages-claimer';
import { useClaimerFormData } from './claimer-data-provider';
import { ClaimerFormInputType, ClaimerFormNetworkData } from './types';

export type ClaimerFlow =
  { action: 'view' } | ({ action: 'set-claimer' } & Executable);

export const useClaimerFlowResolver = (): FlowResolver<
  ClaimerFormInputType,
  ClaimerFormNetworkData,
  ClaimerFlow
> => {
  const sdk = useActiveOperatorSDK();
  const buildCallback = useTxModalStagesClaimer();

  return useCallback(
    (input, data) => {
      if (!data.canEdit) return { action: 'view' };

      const props = () => ({
        nodeOperatorId: data.nodeOperatorId,
        claimerAddress: getClaimerAddress(input),
      });

      return {
        action: 'set-claimer' as const,
        submit: () =>
          sdk.roles.setCustomRewardsClaimer({
            ...props(),
            callback: buildCallback(input, data),
          }),
        estimate: async () =>
          sdk.roles.estimateSetCustomRewardsClaimer(props()),
      };
    },
    [sdk, buildCallback],
  );
};

export const useClaimerFlow = (): ClaimerFlow => {
  const resolve = useClaimerFlowResolver();
  const data = useClaimerFormData(true);
  return resolve({} as ClaimerFormInputType, data);
};
