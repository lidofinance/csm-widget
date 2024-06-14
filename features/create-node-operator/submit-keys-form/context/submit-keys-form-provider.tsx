import { TOKENS } from 'consts/tokens';
import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { SubmitKeysFormDataContext } from './submit-keys-form-context';
import { type SubmitKeysFormInputType } from './types';
import { useCalculateBondAmount } from './use-calculate-bond-amount';
import { useCalculateDepositData } from './use-calculate-deposit-data';
import { useSubmitKeys } from './use-submit-keys';
import { useSubmitKeysFormNetworkData } from './use-submit-keys-form-network-data';
import { useUpdateProof } from './use-update-proof';

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

  const submitKeys = useSubmitKeys({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<SubmitKeysFormInputType> =
    useMemo(
      () => ({
        onSubmit: submitKeys,
        retryEvent,
      }),
      [submitKeys, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <SubmitKeysFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </SubmitKeysFormDataContext.Provider>
    </FormProvider>
  );
};
