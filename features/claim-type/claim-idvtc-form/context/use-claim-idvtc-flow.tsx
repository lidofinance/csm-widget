import { type MethodAccess, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  type PostStep,
  runPostSteps,
} from 'features/create-node-operator/submit-keys-form/hooks/run-post-steps';
import { useCanManageMembers } from 'features/idvtc/members/hooks/use-can-manage-members';
import { useMembersInFlowInit } from 'features/idvtc/members/hooks/use-members-in-flow-init';
import { TxStageMembersInitFailed } from 'features/idvtc/members/tx-stages/tx-stage-members-init-failed';
import { TxStageMembersSignin } from 'features/idvtc/members/tx-stages/tx-stage-members-signin';
import { useSurveyInFlowAuth } from 'features/idvtc/shared/use-survey-in-flow-auth';
import { operatorKey } from 'modules/surveys-sdk';
import { useActiveSmSDK, useModule } from 'modules/web3';
import { useModalActions } from 'providers/modal-provider';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { TransactionModal, useTransitStage } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { classifyErrorCode, ErrorCode } from 'utils/get-error-code';
import {
  trackMatomoRawError,
  trackMatomoSurveySigninDenied,
} from 'utils/track-matomo-event';
import { getClaimTypeAction, useClaimTypeSuccess } from '../../shared';
import { useConfirmClaimIdvtcModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesClaimIdvtc } from '../hooks/use-tx-modal-stages-claim-idvtc';
import { useClaimIdvtcFormData } from './claim-idvtc-data-provider';
import { ClaimIdvtcFormInputType, ClaimIdvtcFormNetworkData } from './types';

export type ClaimIdvtcFlow =
  | { action: 'wrong-module' }
  | { action: 'paused' }
  | { action: 'claimed' }
  | { action: 'claimed-with-proof' }
  | { action: 'not-eligible' }
  | { action: 'no-access'; access: MethodAccess }
  | ({ action: 'claim' } & Executable);

export const useClaimIdvtcFlowResolver = (): FlowResolver<
  ClaimIdvtcFormInputType,
  ClaimIdvtcFormNetworkData,
  ClaimIdvtcFlow
> => {
  const sdk = useActiveSmSDK(MODULE_NAME.CSM);
  invariant(sdk, 'CSM SDK is required for this operation');
  const [, claimAccess] = useCanPerform(sdk.idvtcGate, 'claimCurve');
  const { isCSM } = useModule();
  const { markClaimed } = useClaimTypeSuccess();
  const { closeModal } = useModalActions();
  const confirmClaimIdvtc = useConfirmClaimIdvtcModal();
  const buildCallback = useTxModalStagesClaimIdvtc();
  const surveyAuth = useSurveyInFlowAuth();
  const { checkBindable, initStaged } = useMembersInFlowInit(surveyAuth);
  const canManage = useCanManageMembers();
  const transitStage = useTransitStage();
  const closeTxModal = useCallback(
    () => closeModal(TransactionModal),
    [closeModal],
  );

  return useCallback(
    (input, data) => {
      const action = getClaimTypeAction({
        isCSM,
        paused: data.idvtcPaused,
        proof: data.proof,
        currentCurveId: data.currentCurve?.curveId,
        newCurveId: data.newCurve?.curveId,
        canClaim: data.canClaimCurve,
      });

      if (action === 'no-access') return { action, access: claimAccess };
      if (action !== 'claim') return { action };

      const props = () => {
        invariant(data.proof.proof, 'Proof is not defined');
        invariant(
          data.nodeOperatorId !== undefined,
          'NodeOperatorId is not defined',
        );
        return { nodeOperatorId: data.nodeOperatorId, proof: data.proof.proof };
      };

      // Resolved in confirm() once the SIWE token exists; consumed in submit()
      let willInitMembers = false;

      return {
        action,
        confirm: async () => {
          const ok = await confirmClaimIdvtc({});
          if (!ok) return false;

          if (canManage) {
            try {
              await surveyAuth.ensureAuth(<TxStageMembersSignin />);
            } catch (error) {
              if (classifyErrorCode(error) === ErrorCode.DENIED_SIG) {
                trackMatomoSurveySigninDenied('claim_idvtc');
              }
              // Declined sign-in must not block claiming — skip auto-init
              return true;
            }
            willInitMembers = await checkBindable();
          }
          return true;
        },
        estimate: async () => sdk.idvtcGate.estimateClaimCurve(props()),
        submit: async () => {
          const { receipt } = await sdk.idvtcGate.claimCurve({
            ...props(),
            callback: buildCallback(input, { ...data, willInitMembers }),
          });
          // A multisig tx is only proposed: its own stage stays open
          if (!receipt) return;

          const postSteps: PostStep[] = [];

          if (willInitMembers) {
            const op = operatorKey(MODULE_NAME.CSM, data.nodeOperatorId);
            invariant(op, 'operator key required for members init');

            postSteps.push({
              run: () => initStaged(op),
              onFail: (error, retry) => {
                trackMatomoRawError('members_init', error);
                console.warn('[members] in-flow init failed', error);
                transitStage(
                  <TxStageMembersInitFailed
                    title="IDVTC type claimed — cluster members not initialized"
                    onRetry={retry}
                  />,
                );
              },
            });
          }

          const postStepsDone = await runPostSteps(postSteps, closeTxModal);

          markClaimed();
          // A failed init keeps its retry stage open over the success screen
          if (postStepsDone) closeTxModal();
        },
      };
    },
    [
      isCSM,
      sdk,
      claimAccess,
      markClaimed,
      closeTxModal,
      confirmClaimIdvtc,
      buildCallback,
      surveyAuth,
      checkBindable,
      initStaged,
      canManage,
      transitStage,
    ],
  );
};

export const useClaimIdvtcFlow = (): ClaimIdvtcFlow => {
  const resolve = useClaimIdvtcFlowResolver();
  const data = useClaimIdvtcFormData(true);
  return resolve({} as ClaimIdvtcFormInputType, data);
};
