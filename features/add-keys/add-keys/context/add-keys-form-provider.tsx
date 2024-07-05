import { TOKENS } from 'consts/tokens';
import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import {
  AddKeysFormDataContextValue,
  type AddKeysFormInputType,
} from './types';
import { useAddKeysSubmit } from './use-add-keys-submit';
import { useAddKeysFormNetworkData } from './use-add-keys-form-network-data';
import { useAddKeysFormValidationContext } from './use-add-keys-form-validation-context';
import { useCalculateBondAmount } from './use-calculate-bond-amount';
import { useCalculateDepositData } from './use-calculate-deposit-data';

export const useAddKeysFormData = useFormData<AddKeysFormDataContextValue>;

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddKeysFormNetworkData();
  const validationContextPromise = useAddKeysFormValidationContext(networkData);

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      depositData: [],
    },
    context: validationContextPromise,
    mode: 'onChange',
  });

  useCalculateDepositData(formObject);
  useCalculateBondAmount(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const addKeys = useAddKeysSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

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
