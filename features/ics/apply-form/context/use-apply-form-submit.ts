import { IcsApplyDto } from 'features/ics/shared';
import { useCallback } from 'react';
import { FormSubmitter } from 'shared/hook-form/form-controller';
import { useApplyFormMutation } from '../../shared/use-apply-form-mutation';
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

export const useApplyFormSubmit: FormSubmitter<
  ApplyFormInputType,
  ApplyFormNetworkData
> = ({ onConfirm, onRetry }) => {
  const { txModalStages: stages } = useModalStages();

  const mutation = useApplyFormMutation({
    onMutate: () => {
      stages.pending();
    },
    onSuccess: () => {
      window.scrollTo({ top: 0 });
      stages.success();
      void onConfirm?.();
    },
    onError: (error: any) => {
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
      stages.failed({ message: errorMessage, details: errorDetails }, onRetry);
    },
  });

  return useCallback(
    async (form, data) => {
      const apiPayload = transformFormDataToApiPayload(form, data);
      try {
        await mutation.mutateAsync(apiPayload);
      } catch (error) {
        return false;
      }
      return true;
    },
    [mutation],
  );
};
