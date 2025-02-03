import { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
  useFormDepositData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';
import { useAddKeysFormNetworkData } from './use-add-keys-form-network-data';
import { useAddKeysSubmit } from './use-add-keys-submit';
import { useAddKeysValidation } from './use-add-keys-validation';
import { useFormBondAmount } from './use-form-bond-amount';
import { useGetDefaultValues } from './use-get-default-values';
// DAPPNODE
import useBrainLaunchpadApi from 'dappnode/hooks/use-brain-launchpad-api';

export const useAddKeysFormData = useFormData<AddKeysFormNetworkData>;

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useAddKeysFormNetworkData();
  const validationResolver = useAddKeysValidation(networkData);

  const asyncDefaultValues = useGetDefaultValues(networkData);

  // DAPPNODE
  const { submitKeystores: submitKeysToBrain } = useBrainLaunchpadApi();

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormBondAmount(formObject, networkData);
  useFormDepositData(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const addKeys = useAddKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  // DAPPNODE
  const handleSubmit = useCallback(
    async (
      input: AddKeysFormInputType,
      networkData: AddKeysFormNetworkData,
    ) => {
      const { keystores, password } = formObject.getValues();
      if (keystores && password)
        await submitKeysToBrain({ keystores, password });
      return await addKeys(input, networkData);
    },
    [addKeys, formObject, submitKeysToBrain], // dependencies
  );

  const formControllerValue: FormControllerContextValueType<
    AddKeysFormInputType,
    AddKeysFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: handleSubmit,
      retryEvent,
    }),
    [handleSubmit, retryEvent],
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
