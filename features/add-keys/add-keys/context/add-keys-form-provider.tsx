import { TOKENS } from 'consts/tokens';
import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
  useFormDepositData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import {
  AddKeysFormDataContextValue,
  type AddKeysFormInputType,
} from './types';
import { useAddKeysFormNetworkData } from './use-add-keys-form-network-data';
import { useAddKeysSubmit } from './use-add-keys-submit';
import { useCalculateBondAmount } from './use-calculate-bond-amount';

export const useAddKeysFormData = useFormData<AddKeysFormDataContextValue>;

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddKeysFormNetworkData();

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      depositData: [],
    },
    mode: 'onChange',
  });

  useFormDepositData(formObject);
  const bondAmount = useCalculateBondAmount(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const addKeys = useAddKeysSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = { ...networkData, bondAmount };

  const formControllerValue: FormControllerContextValueType<
    AddKeysFormInputType,
    AddKeysFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: addKeys,
      retryEvent,
    }),
    [addKeys, retryEvent],
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
