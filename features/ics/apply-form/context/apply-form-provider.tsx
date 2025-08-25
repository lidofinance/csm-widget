import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import type { ApplyFormInputType, ApplyFormNetworkData } from './types';
import { useApplyFormNetworkData } from './use-apply-form-network-data';
import { useApplyFormSubmit } from './use-apply-form-submit';
import { useApplyFormValidation } from './use-apply-form-validation';

export const useApplyFormData = useFormData<ApplyFormNetworkData>;

export const ApplyFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useApplyFormNetworkData();

  const validationResolver = useApplyFormValidation(networkData);

  const formObject = useForm<ApplyFormInputType>({
    defaultValues: {
      additionalAddresses: [],
      twitterLink: '',
      discordLink: '',
    },
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useApplyFormSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    ApplyFormInputType,
    ApplyFormNetworkData
  > = useMemo(
    () => ({
      onSubmit,
      retryEvent,
    }),
    [onSubmit, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
