import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import {
  SubmitKeysFormDataContextValue,
  type SubmitKeysFormInputType,
} from './types';
import { TOKENS } from 'shared/hook-form/controls/token-select-hook-form';
import { useSubmitKeys } from '../use-submit-keys';
import { mockKeys } from './mock';
import { SubmitKeysFormDataContext } from './submit-keys-form-context';
import { useSubmitKeysFormNetworkData } from './useSubmitKeysFormNetworkData';
import { useSubmitKeysFormValidationContext } from './validation';

export const SubmitKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSubmitKeysFormNetworkData();
  const validationContextPromise =
    useSubmitKeysFormValidationContext(networkData);

  const formObject = useForm<SubmitKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      parsedKeys: mockKeys,
      referral: null,
    },
    context: validationContextPromise,
    mode: 'onChange',
  });

  const { watch } = formObject;
  const [token, parsedKeys] = watch(['token', 'parsedKeys']);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { submitKeys, bondAmount, isBondAmountLoading } = useSubmitKeys({
    token,
    parsedKeys,
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = useMemo(
    (): SubmitKeysFormDataContextValue => ({
      ...networkData,
      bondAmount,
      isBondAmountLoading,
    }),
    [networkData, bondAmount, isBondAmountLoading],
  );

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
