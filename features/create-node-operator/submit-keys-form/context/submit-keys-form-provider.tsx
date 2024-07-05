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
  SubmitKeysFormDataContextValue,
  type SubmitKeysFormInputType,
} from './types';
import { useCalculateBondAmount } from './use-calculate-bond-amount';
import { useCalculateDepositData } from './use-calculate-deposit-data';
import { useSubmitKeysSubmit } from './use-submit-keys-submit';
import { useSubmitKeysFormNetworkData } from './use-submit-keys-form-network-data';
import { useUpdateProof } from './use-update-proof';

export const useSubmitKeysFormData =
  useFormData<SubmitKeysFormDataContextValue>;

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSubmitKeysFormNetworkData();

  const formObject = useForm<SubmitKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      depositData: [],
    },
    mode: 'onChange',
  });

  useUpdateProof(formObject, networkData);

  useCalculateDepositData(formObject);
  useCalculateBondAmount(formObject, networkData);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const submitKeys = useSubmitKeysSubmit({
    onConfirm: networkData.revalidate,
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
