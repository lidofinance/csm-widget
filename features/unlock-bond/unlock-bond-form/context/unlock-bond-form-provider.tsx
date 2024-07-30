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
  UnlockBondFormNetworkData,
  type UnlockBondFormInputType,
} from './types';
import { useUnlockBondFormNetworkData } from './use-unlock-bond-form-network-data';
import { useUnlockBondSubmit } from './use-unlock-bond-submit';
import { useUnlockBondValidation } from './use-unlock-bond-validation';

export const useUnlockBondFormData = useFormData<UnlockBondFormNetworkData>;

export const UnlockBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useUnlockBondFormNetworkData();
  const validationResolver = useUnlockBondValidation(networkData);

  // TODO: validate (max amount)
  const formObject = useForm<UnlockBondFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { unlockBond } = useUnlockBondSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    UnlockBondFormInputType,
    UnlockBondFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: unlockBond,
      retryEvent,
    }),
    [unlockBond, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
