import { type MethodAccess, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useActiveSmSDK, useModule } from 'modules/web3';
import { useModalActions } from 'providers/modal-provider';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { TransactionModal } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { getClaimTypeAction, useClaimTypeSuccess } from '../../shared';
import { useConfirmClaimIcsModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesClaimIcs } from '../hooks/use-tx-modal-stages-claim-ics';
import { useClaimIcsFormData } from './claim-ics-data-provider';
import { ClaimIcsFormInputType, ClaimIcsFormNetworkData } from './types';

export type ClaimIcsFlow =
  | { action: 'wrong-module' }
  | { action: 'paused' }
  | { action: 'claimed' }
  | { action: 'claimed-with-proof' }
  | { action: 'not-eligible' }
  | { action: 'no-access'; access: MethodAccess }
  | ({ action: 'claim' } & Executable);

export const useClaimIcsFlowResolver = (): FlowResolver<
  ClaimIcsFormInputType,
  ClaimIcsFormNetworkData,
  ClaimIcsFlow
> => {
  const sdk = useActiveSmSDK(MODULE_NAME.CSM);
  invariant(sdk, 'CSM SDK is required for this operation');
  const [, claimAccess] = useCanPerform(sdk.icsGate, 'claimCurve');
  const { isCSM } = useModule();
  const { markClaimed } = useClaimTypeSuccess();
  const { closeModal } = useModalActions();
  const confirmClaimIcs = useConfirmClaimIcsModal();
  const buildCallback = useTxModalStagesClaimIcs();

  return useCallback(
    (input, data) => {
      const action = getClaimTypeAction({
        isCSM,
        paused: data.icsPaused,
        proof: data.proof,
        currentCurveId: data.currentCurve?.curveId,
        newCurveId: data.newCurve?.curveId,
        canClaim: data.canClaimCurve,
      });

      if (action === 'no-access') return { action, access: claimAccess };
      if (action !== 'claim') return { action };

      const props = () => {
        invariant(data.proof.proof, 'Proof is not defined');
        return { nodeOperatorId: data.nodeOperatorId, proof: data.proof.proof };
      };

      return {
        action,
        confirm: () => confirmClaimIcs({}),
        estimate: async () => sdk.icsGate.estimateClaimCurve(props()),
        submit: async () => {
          const { receipt } = await sdk.icsGate.claimCurve({
            ...props(),
            callback: buildCallback(input, data),
          });
          // A multisig tx is only proposed: its own stage stays open
          if (!receipt) return;

          markClaimed();
          closeModal(TransactionModal);
        },
      };
    },
    [
      isCSM,
      sdk,
      claimAccess,
      markClaimed,
      closeModal,
      confirmClaimIcs,
      buildCallback,
    ],
  );
};

export const useClaimIcsFlow = (): ClaimIcsFlow => {
  const resolve = useClaimIcsFlowResolver();
  const data = useClaimIcsFormData(true);
  return resolve({} as ClaimIcsFormInputType, data);
};
