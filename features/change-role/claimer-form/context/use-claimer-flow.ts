import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { zeroAddress } from 'viem';
import { useClaimerFormData } from './claimer-data-provider';
import { ClaimerFormInputType, ClaimerFormNetworkData } from './types';

export type ClaimerFlow =
  | { action: 'view' }
  | ({ action: 'set-claimer' } & Executable);

export const useClaimerFlowResolver = (): FlowResolver<
  ClaimerFormInputType,
  ClaimerFormNetworkData,
  ClaimerFlow
> => {
  const sdk = useSmSDK();

  return useCallback(
    (_input, data) => {
      if (!data.canEdit) return { action: 'view' };

      return {
        action: 'set-claimer' as const,
        submit: (callback) => {
          const claimerAddress = _input.isUnset
            ? zeroAddress
            : (_input.address ?? zeroAddress);

          return sdk.roles.setCustomRewardsClaimer({
            nodeOperatorId: data.nodeOperatorId,
            claimerAddress,
            callback,
          });
        },
      };
    },
    [sdk],
  );
};

export const useClaimerFlow = (): ClaimerFlow => {
  const resolve = useClaimerFlowResolver();
  const data = useClaimerFormData(true);
  return resolve({} as ClaimerFormInputType, data);
};
