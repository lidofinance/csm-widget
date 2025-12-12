import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import type { ApplyFormInputType } from './types';
import { useApplyFormSubmit } from './use-apply-form-submit';
import { useApplyFormValidation } from './use-apply-form-validation';

export const ApplyFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useApplyFormValidation();

  const defaultValues = useFormDefaultValues(() => ({
    additionalAddresses: [],
    twitterLink: '',
    discordLink: '',
  }));

  const formObject = useForm<ApplyFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useApplyFormSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="icsApply">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
