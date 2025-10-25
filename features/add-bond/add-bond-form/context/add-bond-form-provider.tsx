import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { AddBondUpdater } from './add-bond-updater';
import { type AddBondFormInputType } from './types';
import { useAddBondDefaultValues } from './use-add-bond-default-values';
import { useAddBondSubmit } from './use-add-bond-submit';
import { useAddBondValidation } from './use-add-bond-validation';

export const AddBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useAddBondValidation();
  const defaultValues = useAddBondDefaultValues();

  const formObject = useForm<AddBondFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useAddBondSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        <AddBondUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
