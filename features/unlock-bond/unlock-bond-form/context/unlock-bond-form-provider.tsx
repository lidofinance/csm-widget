import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type UnlockBondFormInputType } from './types';
import { useUnlockBondSubmit } from './use-unlock-bond-submit';

export const UnlockBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const formObject = useForm<UnlockBondFormInputType>({
    mode: 'onChange',
  });

  const submitter = useUnlockBondSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="unlockBond">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
