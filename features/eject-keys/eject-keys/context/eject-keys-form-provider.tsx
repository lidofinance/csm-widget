import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { EjectKeysUpdater } from './eject-keys-updater';
import { type EjectKeysFormInputType } from './types';
import { useEjectKeysFlowResolver } from './use-eject-keys-flow';
import { useEjectKeysValidation } from './use-eject-keys-validation';

export const EjectKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useEjectKeysValidation();

  const formObject = useForm<EjectKeysFormInputType>({
    defaultValues: { selection: [] },
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useEjectKeysFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="ejectKeys">
        <EjectKeysUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
