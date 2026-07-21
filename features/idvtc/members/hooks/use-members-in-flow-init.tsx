// features/idvtc/members/hooks/use-members-in-flow-init.tsx
import { useQueryClient } from '@tanstack/react-query';
import { type SurveyInFlowAuth } from 'features/idvtc/shared/use-survey-in-flow-auth';
import {
  callSurvey,
  surveyRequest,
  surveysKeys,
  SurveysApiError,
  type OperatorKey,
} from 'modules/surveys-sdk';
import {
  idvtcGetStatus,
  membersInitFromIdvtc,
} from 'modules/surveys-sdk/generated';
import { useDappStatus } from 'modules/web3';
import { useCallback } from 'react';
import { useTransitStage } from 'shared/transaction-modal';
import { TxStageMembersInitializing } from '../tx-stages/tx-stage-members-initializing';
import { isBindableForm } from '../utils/bindable-form';
import { membersBaseKey } from './members-keys';

// In-flow companion to the members page InitButton: right after
// create-operator / claim-IDVTC, bind the caller's approved unbound form to
// the fresh operator without leaving the tx modal. Mirrors useDkgInFlowUpload
// and shares the flow's SurveyInFlowAuth instance for the same fresh-token
// reason.
export const useMembersInFlowInit = ({ getToken }: SurveyInFlowAuth) => {
  const transitStage = useTransitStage();
  const queryClient = useQueryClient();
  const { address } = useDappStatus();

  // Pre-tx availability check: the connected address's latest form must be
  // APPROVED and not yet bound. Any failure degrades to "not bindable" — the
  // members page InitButton remains as the fallback.
  const checkBindable = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    try {
      const form = await callSurvey(() => idvtcGetStatus(surveyRequest(token)));
      return isBindableForm(form ?? undefined);
    } catch (error) {
      console.warn('[members] bindable form check failed', error);
      return false;
    }
  }, [getToken]);

  const initStaged = useCallback(
    async (op: OperatorKey): Promise<void> => {
      transitStage(<TxStageMembersInitializing />);
      try {
        await callSurvey(() =>
          membersInitFromIdvtc({
            ...surveyRequest(getToken()),
            path: { nodeOperatorId: op },
          }),
        );
      } catch (error) {
        // A retry racing an attempt that actually landed: treat as success
        const alreadyInitialized =
          error instanceof SurveysApiError &&
          error.code === 'MEMBERS_ALREADY_INITIALIZED';
        if (!alreadyInitialized) throw error;
      }
      await queryClient.invalidateQueries({ queryKey: membersBaseKey(op) });
      await queryClient.invalidateQueries({
        queryKey: surveysKeys.authPath('idvtc/status', address),
      });
    },
    [transitStage, queryClient, getToken, address],
  );

  return { checkBindable, initStaged };
};
