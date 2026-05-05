import {
  DvtApplyDto,
  useApplyFormMutation,
  useDvtState,
} from 'features/dvt/shared';
import { useCallback } from 'react';
import type { DvtApplyFormInputType, DvtApplyFormNetworkData } from './types';
import { useModalStages } from './use-modal-stages';

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

export const useApplyFormSubmit = (clearPersistedForm?: () => void) => {
  const { txModalStages: stages } = useModalStages();
  const { reset } = useDvtState();

  const mutation = useApplyFormMutation({});

  return useCallback(
    async (
      form: DvtApplyFormInputType,
      data: DvtApplyFormNetworkData,
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
        clearPersistedForm?.();
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
    [clearPersistedForm, mutation, reset, stages],
  );
};
