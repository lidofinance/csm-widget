import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { EjectKeysUpdater } from './eject-keys-updater';
import { type EjectKeysFormInputType } from './types';
import { useEjectKeysSubmit } from './use-eject-keys-submit';
import { useEjectKeysValidation } from './use-eject-keys-validation';

export const EjectKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useEjectKeysValidation();

  const formObject = useForm<EjectKeysFormInputType>({
    defaultValues: { selection: [] },
    resolver,
    mode: 'onChange',
  });

  const submitter = useEjectKeysSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        <EjectKeysUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
