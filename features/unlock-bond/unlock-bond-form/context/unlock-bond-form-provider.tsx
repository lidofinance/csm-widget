import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type UnlockBondFormInputType } from './types';
import { useUnlockBondSubmit } from './use-unlock-bond-submit';
import { useUnlockBondValidation } from './use-unlock-bond-validation';

export const UnlockBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const validationResolver = useUnlockBondValidation();

  const formObject = useForm<UnlockBondFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver: validationResolver,
    mode: 'onChange',
  });

  const submitter = useUnlockBondSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
