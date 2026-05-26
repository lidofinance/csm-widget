import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import invariant from 'tiny-invariant';
import { useConfirmClaimIdvtcModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesClaimIdvtc } from '../hooks/use-tx-modal-stages-claim-idvtc';
import { useClaimIdvtcFormData } from './claim-idvtc-data-provider';
import { ClaimIdvtcFormInputType, ClaimIdvtcFormNetworkData } from './types';

export type ClaimIdvtcFlow =
  | { action: 'paused' }
  | { action: 'claimed' }
  | { action: 'claimed-with-proof' }
  | { action: 'not-eligible' }
  | { action: 'no-access' }
  | { action: 'create' }
  | ({ action: 'claim' } & Executable);

export const useClaimIdvtcFlowResolver = (): FlowResolver<
  ClaimIdvtcFormInputType,
  ClaimIdvtcFormNetworkData,
  ClaimIdvtcFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CSM);
  invariant(sdk, 'CSM SDK is required for this operation');
  const confirmClaimIdvtc = useConfirmClaimIdvtcModal();
  const buildCallback = useTxModalStagesClaimIdvtc();

  return useCallback(
    (input, data) => {
      if (data.idvtcPaused) return { action: 'paused' };

      const isEmpty = !data.proof?.proof || data.proof.isConsumed;

      const isClaimed =
        data.currentCurveId === data.newCurveId &&
        data.currentCurveId !== undefined;
      if (isClaimed) {
        return { action: isEmpty ? 'claimed' : 'claimed-with-proof' };
      }

      if (isEmpty) return { action: 'not-eligible' };
      if (!data.canClaimCurve) return { action: 'no-access' };

      // 'create' is a navigation path (link), not a submit — don't run the tx
      if (data.isCurrentIcs && input.mode === 'create') {
        return { action: 'create' };
      }

      return {
        action: 'claim' as const,
        confirm: () => confirmClaimIdvtc({}),
        submit: async () => {
          invariant(data.proof.proof, 'Proof is not defined');
          invariant(
            data.nodeOperatorId !== undefined,
            'NodeOperatorId is not defined',
          );

          await sdk.idvtcGate.claimCurve({
            nodeOperatorId: data.nodeOperatorId,
            proof: data.proof.proof,
            callback: buildCallback(input, data),
          });

          window.scrollTo({ top: 0 });
        },
      };
    },
    [sdk, confirmClaimIdvtc, buildCallback],
  );
};

export const useClaimIdvtcFlow = (): ClaimIdvtcFlow => {
  const resolve = useClaimIdvtcFlowResolver();
  const data = useClaimIdvtcFormData(true);
  return resolve({} as ClaimIdvtcFormInputType, data);
};
