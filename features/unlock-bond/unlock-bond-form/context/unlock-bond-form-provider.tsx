import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type UnlockBondFormInputType } from './types';
import { useUnlockBondFlowResolver } from './use-unlock-bond-flow';

export const UnlockBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const formObject = useForm<UnlockBondFormInputType>({
    mode: 'onChange',
  });

  const resolve = useUnlockBondFlowResolver();
  const submitter = useFlowSubmit(resolve);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        resolve={resolve}
        formName="unlockBond"
      >
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
