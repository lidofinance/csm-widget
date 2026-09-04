import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useModule, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useTxModalStagesClaimIcs } from '../hooks/use-tx-modal-stages-claim-ics';
import { useConfirmClaimIcsModal } from '../hooks/use-confirm-modal';
import { useClaimIcsFormData } from './claim-ics-data-provider';
import { ClaimIcsFormInputType, ClaimIcsFormNetworkData } from './types';

export type ClaimIcsFlow =
  | { action: 'wrong-module' }
  | { action: 'paused' }
  | { action: 'claimed' }
  | { action: 'claimed-with-proof' }
  | { action: 'not-eligible' }
  | { action: 'no-access' }
  | ({ action: 'claim' } & Executable);

export const useClaimIcsFlowResolver = (): FlowResolver<
  ClaimIcsFormInputType,
  ClaimIcsFormNetworkData,
  ClaimIcsFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CSM);
  invariant(sdk, 'CSM SDK is required for this operation');
  const { isCSM } = useModule();
  const confirmClaimIcs = useConfirmClaimIcsModal();
  const buildCallback = useTxModalStagesClaimIcs();

  return useCallback(
    (input, data) => {
      // ICS is a CSM type: it cannot be claimed onto an operator of another module
      if (!isCSM) return { action: 'wrong-module' };
      if (data.icsPaused) return { action: 'paused' };

      const isEmpty = !data.proof?.proof || data.proof.isConsumed;

      const isClaimed =
        data.currentCurve?.curveId === data.newCurve?.curveId &&
        !!data.currentCurve;
      if (isClaimed) {
        return { action: isEmpty ? 'claimed' : 'claimed-with-proof' };
      }

      if (isEmpty) return { action: 'not-eligible' };
      if (!data.canClaimCurve) return { action: 'no-access' };

      return {
        action: 'claim' as const,
        confirm: () => confirmClaimIcs({}),
        submit: async () => {
          invariant(data.proof.proof, 'Proof is not defined');

          await sdk.icsGate.claimCurve({
            nodeOperatorId: data.nodeOperatorId,
            proof: data.proof.proof,
            callback: buildCallback(input, data),
          });

          window.scrollTo({ top: 0 });
        },
      };
    },
    [isCSM, sdk, confirmClaimIcs, buildCallback],
  );
};

export const useClaimIcsFlow = (): ClaimIcsFlow => {
  const resolve = useClaimIcsFlowResolver();
  const data = useClaimIcsFormData(true);
  return resolve({} as ClaimIcsFormInputType, data);
};
