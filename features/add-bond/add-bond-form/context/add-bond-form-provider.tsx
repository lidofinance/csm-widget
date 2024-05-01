import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller';
import { useAddBondFormNetworkData } from '../hooks/use-add-bond-form-network-data';
import { useAddBond } from '../hooks/use-add-bond';
import { AddBondFormDataContext } from './add-bond-form-context';
import { type AddBondFormInputType } from './types';

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddBondFormNetworkData();

  const formObject = useForm<AddBondFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      amount: null,
    },
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { addBond } = useAddBond({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<AddBondFormInputType> =
    useMemo(
      () => ({
        onSubmit: addBond,
        retryEvent,
      }),
      [addBond, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <AddBondFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </AddBondFormDataContext.Provider>
    </FormProvider>
  );
};
