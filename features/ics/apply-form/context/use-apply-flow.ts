import { IcsApplyDto, IcsResponseDto, useIcsState } from 'features/ics/shared';
import {
  callSurvey,
  isAuthError,
  surveyRequest,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import { icsApply } from 'modules/surveys-sdk/generated';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type {
  Executable,
  FlowResolver,
} from 'shared/hook-form/form-controller';
import { applyApiFieldErrors } from 'shared/hook-form';
import type { ApplyFormInputType, ApplyFormNetworkData } from './types';
import { useModalStages } from './use-modal-stages';

export type ApplyFlow = { action: 'submit' } & Executable;

const transformFormDataToApiPayload = (
  form: ApplyFormInputType,
  data: ApplyFormNetworkData,
): IcsApplyDto => ({
  mainAddress: data.mainAddress,
  additionalAddresses: form.additionalAddresses,
  twitterLink: form.twitterLink || undefined,
  discordLink: form.discordLink || undefined,
});

export const useApplyFlowResolver = (): FlowResolver<
  ApplyFormInputType,
  ApplyFormNetworkData,
  ApplyFlow
> => {
  const stages = useModalStages();
  const { reset } = useIcsState();
  const { setError, getValues } = useFormContext<ApplyFormInputType>();
  const mutation = useSurveyMutation<IcsResponseDto, IcsApplyDto>(
    (body, { token }) =>
      callSurvey(() => icsApply({ ...surveyRequest(token), body })),
    { mutationKey: ['ics-apply'] },
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
          stages.success();
        } catch (error) {
          window.scrollTo({ top: 0 });
          const handledInline = applyApiFieldErrors(
            error,
            setError,
            Object.keys(getValues()),
          );
          if (!handledInline && !isAuthError(error)) stages.failed(error);
          throw error;
        }
      },
    }),
    [getValues, mutation, reset, setError, stages],
  );
};
