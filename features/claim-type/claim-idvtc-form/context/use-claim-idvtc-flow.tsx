import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import { useCanManageMembers } from 'features/idvtc/members/hooks/use-can-manage-members';
import { useMembersInFlowInit } from 'features/idvtc/members/hooks/use-members-in-flow-init';
import { TxStageMembersInitFailed } from 'features/idvtc/members/tx-stages/tx-stage-members-init-failed';
import { TxStageMembersSignin } from 'features/idvtc/members/tx-stages/tx-stage-members-signin';
import { useSurveyInFlowAuth } from 'features/idvtc/shared/use-survey-in-flow-auth';
import { operatorKey } from 'modules/surveys-sdk';
import { useModule, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { TxStageSuccess, useTransitStage } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { classifyErrorCode, ErrorCode } from 'utils/get-error-code';
import {
  trackMatomoRawError,
  trackMatomoSurveySigninDenied,
} from 'utils/track-matomo-event';
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
  const { isCSM } = useModule();
  const confirmClaimIdvtc = useConfirmClaimIdvtcModal();
  const buildCallback = useTxModalStagesClaimIdvtc();
  const surveyAuth = useSurveyInFlowAuth();
  const { checkBindable, initStaged } = useMembersInFlowInit(surveyAuth);
  const canManage = useCanManageMembers();
  const transitStage = useTransitStage();

  return useCallback(
    (input, data) => {
      // IDVTC is a CSM type: it cannot be claimed onto an operator of another module
      if (!isCSM) return { action: 'wrong-module' };
      if (data.idvtcPaused) return { action: 'paused' };

      const isEmpty = !data.proof?.proof || data.proof.isConsumed;

      const isClaimed =
        data.currentCurve?.curveId === data.newCurve?.curveId &&
        !!data.currentCurve;
      if (isClaimed) {
        return { action: isEmpty ? 'claimed' : 'claimed-with-proof' };
      }

      if (isEmpty) return { action: 'not-eligible' };
      if (!data.canClaimCurve) return { action: 'no-access' };

      // 'create' is a navigation path (link), not a submit — don't run the tx
      if (data.isCurrentIcs && input.mode === 'create') {
        return { action: 'create' };
      }

      // Resolved in confirm() once the SIWE token exists; consumed in submit()
      let willInitMembers = false;

      return {
        action: 'claim' as const,
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
        submit: async () => {
          invariant(data.proof.proof, 'Proof is not defined');
          invariant(
            data.nodeOperatorId !== undefined,
            'NodeOperatorId is not defined',
          );

          await sdk.idvtcGate.claimCurve({
            nodeOperatorId: data.nodeOperatorId,
            proof: data.proof.proof,
            callback: buildCallback(input, { ...data, willInitMembers }),
          });

          if (willInitMembers) {
            const op = operatorKey(config.module, data.nodeOperatorId);

            const runInit = async (): Promise<void> => {
              invariant(op, 'operator key required for members init');
              try {
                await initStaged(op);
                transitStage(
                  <TxStageSuccess
                    title="IDVTC type has been successfully claimed"
                    description="Cluster members have been initialized"
                  />,
                );
              } catch (error) {
                trackMatomoRawError('members_init', error);
                console.warn('[members] in-flow init failed', error);
                transitStage(
                  <TxStageMembersInitFailed
                    title="IDVTC type claimed — cluster members not initialized"
                    onRetry={() => void runInit()}
                  />,
                );
              }
            };

            await runInit();
          }

          window.scrollTo({ top: 0 });
        },
      };
    },
    [
      isCSM,
      sdk,
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
