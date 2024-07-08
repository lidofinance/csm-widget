import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import {
  UnlockBondFormDataContextValue,
  type UnlockBondFormInputType,
} from './types';
import { useUnlockBondFormNetworkData } from './use-unlock-bond-form-network-data';
import { useUnlockBondSubmit } from './use-unlock-bond-submit';

export const useUnlockBondFormData =
  useFormData<UnlockBondFormDataContextValue>;

export const UnlockBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useUnlockBondFormNetworkData();

  // TODO: validate (max amount)
  const formObject = useForm<UnlockBondFormInputType>({
    defaultValues: {
      amount: null,
    },
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { unlockBond } = useUnlockBondSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    UnlockBondFormInputType,
    UnlockBondFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: unlockBond,
      retryEvent,
    }),
    [unlockBond, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
