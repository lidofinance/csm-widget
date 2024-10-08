import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import { AddBondFormNetworkData, type AddBondFormInputType } from './types';
import { useAddBondFormNetworkData } from './use-add-bond-form-network-data';
import { useAddBondSubmit } from './use-add-bond-submit';
import { useAddBondValidation } from './use-add-bond-validation';
import { useFormRevalidate } from './use-form-revalidate';
import { useGetDefaultValues } from './use-get-default-values';

export const useAddBondFormData = useFormData<AddBondFormNetworkData>;

export const AddBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useAddBondFormNetworkData();
  const validationResolver = useAddBondValidation(networkData);
  const asyncDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<AddBondFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormRevalidate(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { addBond } = useAddBondSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    AddBondFormInputType,
    AddBondFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: addBond,
      retryEvent,
    }),
    [addBond, retryEvent],
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
