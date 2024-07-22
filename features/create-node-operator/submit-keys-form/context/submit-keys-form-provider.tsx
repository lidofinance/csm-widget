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
  SubmitKeysFormDataContextValue,
  type SubmitKeysFormInputType,
} from './types';
import { useContextPromise } from './use-context-promise';
import { useFormBondAmount } from './use-form-bond-amount';
import { useSubmitKeysFormNetworkData } from './use-submit-keys-form-network-data';
import { useSubmitKeysSubmit } from './use-submit-keys-submit';
import { validationResolver } from './validation-resolver';

export const useSubmitKeysFormData =
  useFormData<SubmitKeysFormDataContextValue>;

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useSubmitKeysFormNetworkData();
  const contextPromise = useContextPromise(networkData);

  const formObject = useForm<SubmitKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      depositData: [],
    },
    context: contextPromise,
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormBondAmount(formObject, networkData);
  useFormDepositData(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const submitKeys = useSubmitKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    SubmitKeysFormInputType,
    SubmitKeysFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: submitKeys,
      retryEvent,
    }),
    [submitKeys, retryEvent],
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
