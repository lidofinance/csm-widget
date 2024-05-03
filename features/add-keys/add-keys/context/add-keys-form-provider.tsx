import { TOKENS } from 'consts/tokens';
import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { AddKeysFormDataContext } from './add-keys-form-context';
import { type AddKeysFormInputType } from './types';
import { useAddKeys } from './use-add-keys';
import { useAddKeysFormNetworkData } from './use-add-keys-form-network-data';
import { useAddKeysFormValidationContext } from './use-add-keys-form-validation-context';
import { useCalculateBondAmount } from './use-calculate-bond-amount';
import { useCalculateDepositData } from './use-calculate-deposit-data';

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

  const addKeys = useAddKeys({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<AddKeysFormInputType> =
    useMemo(
      () => ({
        onSubmit: addKeys,
        retryEvent,
      }),
      [addKeys, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <AddKeysFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </AddKeysFormDataContext.Provider>
    </FormProvider>
  );
};
