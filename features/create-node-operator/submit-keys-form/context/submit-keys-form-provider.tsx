import { TOKENS } from 'consts/tokens';
import { FC, PropsWithChildren, useMemo } from 'react';
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
import { useSubmitKeysFormNetworkData } from './use-submit-keys-form-network-data';
import { useSubmitKeysSubmit } from './use-submit-keys-submit';
import { useSubmitKeysValidation } from './use-submit-keys-validation';

export const useSubmitKeysFormData = useFormData<SubmitKeysFormNetworkData>;

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useSubmitKeysFormNetworkData();
  const validationResolver = useSubmitKeysValidation(networkData);

  const formObject = useForm<SubmitKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      depositData: [],
      extendedManagerPermissions: false,
      specifyCustomAddresses: false,
      specifyReferrrer: false,
    },
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

  const formControllerValue: FormControllerContextValueType<
    SubmitKeysFormInputType,
    SubmitKeysFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: submitKeys,
      retryEvent,
    }),
    [submitKeys, retryEvent],
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
