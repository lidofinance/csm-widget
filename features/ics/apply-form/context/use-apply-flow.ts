import {
  IcsApplyDto,
  useApplyFormMutation,
  useIcsState,
} from 'features/ics/shared';
import { useCallback } from 'react';
import type {
  Executable,
  FlowResolver,
} from 'shared/hook-form/form-controller';
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
  const mutation = useApplyFormMutation({});

  return useCallback(
    (input, data) => ({
      action: 'submit' as const,
      submit: async (onRetry) => {
        const apiPayload = transformFormDataToApiPayload(input, data);

        try {
          stages.pending();
          await mutation.mutateAsync(apiPayload);
          window.scrollTo({ top: 0 });
          reset(false);
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
          stages.failed(
            { message: errorMessage, details: errorDetails },
            onRetry,
          );
          throw error;
        }
      },
    }),
    [mutation, reset, stages],
  );
};
