import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';
import { useAddKeysFormNetworkData } from './use-add-keys-form-network-data';
import { useAddKeysSubmit } from './use-add-keys-submit';
import { useAddKeysValidation } from './use-add-keys-validation';
import { useFormBondAmount } from './use-form-bond-amount';
import { useGetDefaultValues } from './use-get-default-values';

export const useAddKeysFormData = useFormData<AddKeysFormNetworkData>;

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useAddKeysFormNetworkData();
  const validationResolver = useAddKeysValidation(networkData);

  const asyncDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormBondAmount(formObject, networkData);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const addKeys = useAddKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    AddKeysFormInputType,
    AddKeysFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: addKeys,
      retryEvent,
    }),
    [addKeys, retryEvent],
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
