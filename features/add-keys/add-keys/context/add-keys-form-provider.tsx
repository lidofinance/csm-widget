import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { AddKeysUpdater } from './add-keys-updater';
import { AddKeysFormInputType } from './types';
import { useAddKeysDefaultValues } from './use-add-keys-default-values';
import { useAddKeysSubmit } from './use-add-keys-submit';
import { useAddKeysValidation } from './use-add-keys-validation';

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useAddKeysValidation();
  const asyncDefaultValues = useAddKeysDefaultValues();

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useAddKeysSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="addKeys">
        <AddKeysUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
