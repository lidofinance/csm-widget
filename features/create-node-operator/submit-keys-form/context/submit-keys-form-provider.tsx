import { useModifyContext } from 'providers/modify-provider';
import { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
  useFormDepositData,
} from 'shared/hook-form/form-controller';
import {
  SubmitKeysFormNetworkData,
  type SubmitKeysFormInputType,
} from './types';
import { useFormBondAmount } from './use-form-bond-amount';
import { useGetDefaultValues } from './use-get-default-values';
import { useSubmitKeysFormNetworkData } from './use-submit-keys-form-network-data';
import { useSubmitKeysSubmit } from './use-submit-keys-submit';
import { useSubmitKeysValidation } from './use-submit-keys-validation';
// DAPPNODE
import useBrainLaunchpadApi from 'dappnode/hooks/use-brain-launchpad-api';

export const useSubmitKeysFormData = useFormData<SubmitKeysFormNetworkData>;

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useSubmitKeysFormNetworkData();
  const validationResolver = useSubmitKeysValidation(networkData);

  const { referrer } = useModifyContext();

  const asyncDefaultValues = useGetDefaultValues(networkData, referrer);

  const formObject = useForm<SubmitKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormBondAmount(formObject, networkData);
  useFormDepositData(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();
  // DAPPNODE
  const { submitKeystores: submitKeysToBrain } = useBrainLaunchpadApi();

  const submitKeys = useSubmitKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  // DAPPNODE
  const handleSubmit = useCallback(
    async (
      input: SubmitKeysFormInputType,
      networkData: SubmitKeysFormNetworkData,
    ) => {
      const { keystores, password } = formObject.getValues();
      if (keystores && password)
        await submitKeysToBrain({ keystores, password });
      return await submitKeys(input, networkData);
    },
    [formObject, submitKeys, submitKeysToBrain], // dependencies
  );

  const formControllerValue: FormControllerContextValueType<
    SubmitKeysFormInputType,
    SubmitKeysFormNetworkData
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
