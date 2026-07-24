import {
  IdvtcApplyDto,
  IdvtcResponseDto,
  useIdvtcState,
} from 'features/idvtc/shared';
import {
  callSurvey,
  isAuthError,
  surveyRequest,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import { idvtcApply } from 'modules/surveys-sdk/generated';
import { useCallback } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import type {
  Executable,
  FlowResolver,
} from 'shared/hook-form/form-controller';
import { applyApiFieldErrors } from 'shared/hook-form';
import { CLUSTER_SIZE } from './consts';
import type {
  IdvtcApplyFormInputType,
  IdvtcApplyFormNetworkData,
} from './types';
import { useModalStages } from './use-modal-stages';

export type ApplyFlow = { action: 'submit' } & Executable;

const transformFormDataToApiPayload = (
  form: IdvtcApplyFormInputType,
  data: IdvtcApplyFormNetworkData,
): IdvtcApplyDto => {
  // The form always carries exactly CLUSTER_SIZE (4) members (enforced by
  // validation + the submit button gate). Build the fixed 4-tuple the
  // generated `IdvtcApplyDto` expects.
  const clusterMembers = form.clusterMembers
    .slice(0, CLUSTER_SIZE)
    .map(({ address, signature, discordHandle, telegramUsername }) => ({
      address,
      signature,
      discordHandle: discordHandle || undefined,
      telegramUsername: telegramUsername || undefined,
    })) as IdvtcApplyDto['clusterMembers'];

  return {
    mainAddress: data.mainAddress,
    discordLink: form.discordLink,
    telegramUsername: form.telegramUsername || undefined,
    clusterMembers,
  };
};

export const useApplyFlowResolver = (
  setError: UseFormSetError<IdvtcApplyFormInputType>,
  clearPersistedForm?: () => void,
): FlowResolver<
  IdvtcApplyFormInputType,
  IdvtcApplyFormNetworkData,
  ApplyFlow
> => {
  const { txModalStages: stages } = useModalStages();
  const { reset } = useIdvtcState();
  const mutation = useSurveyMutation<IdvtcResponseDto, IdvtcApplyDto>(
    (body, { token }) =>
      callSurvey(() => idvtcApply({ ...surveyRequest(token), body })),
    { mutationKey: ['idvtc-apply'] },
  );

  return useCallback(
    (input, data) => ({
      action: 'submit' as const,
      submit: async () => {
        const apiPayload = transformFormDataToApiPayload(input, data);

        try {
          stages.pending();
          await mutation.mutateAsync(apiPayload);
          window.scrollTo({ top: 0 });
          reset(false);
          clearPersistedForm?.();
          stages.success();
        } catch (error) {
          window.scrollTo({ top: 0 });
          // TODO: refactor this to use a more generic error handling approach
          const handledInline = applyApiFieldErrors(
            error,
            setError,
            Object.keys(input),
          );
          if (!handledInline && !isAuthError(error)) stages.failed(error);
          throw error;
        }
      },
    }),
    [clearPersistedForm, mutation, reset, setError, stages],
  );
};
