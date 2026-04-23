import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import type { ApplyFormInputType } from './types';
import { useApplyFlowResolver } from './use-apply-flow';
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

  const submitter = useFlowSubmit(useApplyFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="icsApply">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
