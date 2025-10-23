import {
  IcsApplyDto,
  useApplyFormMutation,
  useIcsState,
} from 'features/ics/shared';
import { useCallback } from 'react';
import type { ApplyFormInputType, ApplyFormNetworkData } from './types';
import { useModalStages } from './use-modal-stages';

const transformFormDataToApiPayload = (
  form: ApplyFormInputType,
  data: ApplyFormNetworkData,
): IcsApplyDto => {
  return {
    mainAddress: data.mainAddress,
    additionalAddresses: form.additionalAddresses,
    twitterLink: form.twitterLink || undefined,
    discordLink: form.discordLink || undefined,
  };
};

export const useApplyFormSubmit = () => {
  const { txModalStages: stages } = useModalStages();
  const { reset } = useIcsState();

  const mutation = useApplyFormMutation({});

  return useCallback(
    async (
      form: ApplyFormInputType,
      data: ApplyFormNetworkData,
      {
        onConfirm,
        onRetry,
      }: { onConfirm?: () => void | Promise<void>; onRetry: () => void },
    ) => {
      const apiPayload = transformFormDataToApiPayload(form, data);

      try {
        stages.pending();
        await mutation.mutateAsync(apiPayload);
        window.scrollTo({ top: 0 });
        reset(false);
        stages.success();
        void onConfirm?.();
        return true;
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
        return false;
      }
    },
    [mutation, reset, stages],
  );
};
