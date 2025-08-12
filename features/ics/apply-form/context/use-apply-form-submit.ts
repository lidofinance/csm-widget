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
      stages.success();
      void onConfirm?.();
    },
    onError: (error) => {
      // FIXME: get error from response
      stages.failed(error, onRetry);
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
