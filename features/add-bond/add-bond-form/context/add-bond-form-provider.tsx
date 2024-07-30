import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller';
import { useAddBondFormNetworkData } from './use-add-bond-form-network-data';
import { useAddBondSubmit } from './use-add-bond-submit';
import { AddBondFormNetworkData, type AddBondFormInputType } from './types';
import { useAddBondValidation } from './use-add-bond-validation';
import { useFormRevalidate } from './use-form-revalidate';

export const useAddBondFormData = useFormData<AddBondFormNetworkData>;

export const AddBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useAddBondFormNetworkData();
  const validationResolver = useAddBondValidation(networkData);

  // TODO: default token = token_with_max_amount
  const formObject = useForm<AddBondFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      bondAmount: undefined,
    },
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
