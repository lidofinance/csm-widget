import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { SubmitKeysUpdater } from './submit-keys-updater';
import { type SubmitKeysFormInputType } from './types';
import { useSubmitKeysDefaultValues } from './use-submit-keys-default-values';
import { useSubmitKeysSubmit } from './use-submit-keys-submit';
import { useSubmitKeysValidation } from './use-submit-keys-validation';

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useSubmitKeysValidation();
  const defaultValues = useSubmitKeysDefaultValues();

  const formObject = useForm<SubmitKeysFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useSubmitKeysSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="createNodeOperator"
      >
        <SubmitKeysUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
