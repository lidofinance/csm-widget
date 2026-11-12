import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { AddKeysUpdater } from './add-keys-updater';
import { AddKeysFormInputType } from './types';
import { useAddKeysFlowResolver } from './use-add-keys-flow';
import { useAddKeysDefaultValues } from './use-add-keys-default-values';
import { useAddKeysValidation } from './use-add-keys-validation';

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useAddKeysValidation();
  const asyncDefaultValues = useAddKeysDefaultValues();

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver,
    mode: 'onChange',
  });

  const resolve = useAddKeysFlowResolver();
  const submitter = useFlowSubmit(resolve);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        resolve={resolve}
        formName="addKeys"
      >
        <AddKeysUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
