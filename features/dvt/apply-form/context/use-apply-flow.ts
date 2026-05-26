import { DvtApplyDto, DvtResponseDto, useDvtState } from 'features/dvt/shared';
import { endpoints, useSurveysMutation } from 'modules/surveys-sdk';
import { useCallback } from 'react';
import type {
  Executable,
  FlowResolver,
} from 'shared/hook-form/form-controller';
import type { DvtApplyFormInputType, DvtApplyFormNetworkData } from './types';
import { useModalStages } from './use-modal-stages';

export type ApplyFlow = { action: 'submit' } & Executable;

const transformFormDataToApiPayload = (
  form: DvtApplyFormInputType,
  data: DvtApplyFormNetworkData,
): DvtApplyDto => ({
  mainAddress: data.mainAddress,
  discordLink: form.discordLink,
  telegramUsername: form.telegramUsername || undefined,
  clusterMembers: form.clusterMembers.map(
    ({ address, signature, discordHandle, telegramUsername }) => ({
      address,
      signature,
      discordHandle: discordHandle || undefined,
      telegramUsername: telegramUsername || undefined,
    }),
  ),
});

export const useApplyFlowResolver = (
  clearPersistedForm?: () => void,
): FlowResolver<DvtApplyFormInputType, DvtApplyFormNetworkData, ApplyFlow> => {
  const { txModalStages: stages } = useModalStages();
  const { reset } = useDvtState();
  const mutation = useSurveysMutation<DvtResponseDto, DvtApplyDto>(
    endpoints.dvtApply,
    { mutationKey: ['dvt-apply'] },
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
        } catch (error: any) {
          let errorMessage = 'Something went wrong';
          let errorDetails: string[] = [];

          if (error?.response?.data?.message) {
            const messages = error.response.data.message;
            if (Array.isArray(messages)) {
              errorDetails = messages;
              errorMessage = `Validation failed: ${messages.length} error${messages.length > 1 ? 's' : ''}`;
            } else if (typeof messages === 'string') {
              errorMessage = messages;
            }
          } else if (error?.message) {
            errorMessage = error.message;
          }

          window.scrollTo({ top: 0 });
          stages.failed({ message: errorMessage, details: errorDetails });
          throw error;
        }
      },
    }),
    [clearPersistedForm, mutation, reset, stages],
  );
};
