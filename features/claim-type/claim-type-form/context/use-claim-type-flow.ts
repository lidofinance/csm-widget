import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useConfirmClaimTypeModal } from '../hooks/use-confirm-modal';
import { useClaimTypeFormData } from './claim-type-data-provider';
import { ClaimTypeFormInputType, ClaimTypeFormNetworkData } from './types';

export type ClaimTypeFlow =
  | { action: 'paused' }
  | { action: 'claimed' }
  | { action: 'not-eligible' }
  | { action: 'no-access' }
  | ({ action: 'claim' } & Executable);

export const useClaimTypeFlowResolver = (): FlowResolver<
  ClaimTypeFormInputType,
  ClaimTypeFormNetworkData,
  ClaimTypeFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CSM);
  invariant(sdk, 'CSM SDK is required for this operation');
  const confirmClaimtype = useConfirmClaimTypeModal();

  return useCallback(
    (_input, data) => {
      if (data.icsPaused) return { action: 'paused' };

      const isClaimed =
        data.currentCurveId === data.newCurveId &&
        data.currentCurveId !== undefined;
      if (isClaimed) return { action: 'claimed' };

      const isEmpty = !data.proof?.proof || data.proof.isConsumed;
      if (isEmpty) return { action: 'not-eligible' };

      if (!data.canClaimCurve) return { action: 'no-access' };

      return {
        action: 'claim' as const,
        confirm: () => confirmClaimtype({}),
        submit: async (callback) => {
          invariant(data.proof.proof, 'Proof is not defined');

          await sdk.icsGate.claimCurve({
            nodeOperatorId: data.nodeOperatorId,
            proof: data.proof.proof,
            callback,
          });

          window.scrollTo({ top: 0 });
        },
      };
    },
    [sdk, confirmClaimtype],
  );
};

export const useClaimTypeFlow = (): ClaimTypeFlow => {
  const resolve = useClaimTypeFlowResolver();
  const data = useClaimTypeFormData(true);
  return resolve({} as ClaimTypeFormInputType, data);
};
