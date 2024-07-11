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
import {
  AddBondFormDataContextValue,
  type AddBondFormInputType,
} from './types';

export const useAddBondFormData = useFormData<AddBondFormDataContextValue>;

export const AddBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddBondFormNetworkData();

  // TODO: default token = token_with_max_amount
  const formObject = useForm<AddBondFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      amount: undefined,
    },
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { addBond } = useAddBondSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    AddBondFormInputType,
    AddBondFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: addBond,
      retryEvent,
    }),
    [addBond, retryEvent],
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
