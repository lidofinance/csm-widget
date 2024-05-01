import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import {
  AddKeysFormDataContextValue,
  type AddKeysFormInputType,
} from './types';
import { TOKENS } from 'consts/tokens';
import { useAddKeys } from './use-add-keys';
import { mockKeys } from './mock';
import { AddKeysFormDataContext } from './add-keys-form-context';
import { useAddKeysFormNetworkData } from './use-add-keys-form-network-data';
import { useAddKeysFormValidationContext } from './use-add-keys-form-validation-context';

export const AddKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddKeysFormNetworkData();
  const validationContextPromise = useAddKeysFormValidationContext(networkData);

  const formObject = useForm<AddKeysFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      rawKeys: JSON.stringify(mockKeys),
      parsedKeys: mockKeys,
    },
    context: validationContextPromise,
    mode: 'onChange',
  });

  const { watch } = formObject;
  const [token, parsedKeys] = watch(['token', 'parsedKeys']);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { submitKeys, bondAmount, isBondAmountLoading } = useAddKeys({
    token,
    parsedKeys,
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = useMemo(
    (): AddKeysFormDataContextValue => ({
      ...networkData,
      bondAmount,
      isBondAmountLoading,
    }),
    [networkData, bondAmount, isBondAmountLoading],
  );

  const formControllerValue: FormControllerContextValueType<AddKeysFormInputType> =
    useMemo(
      () => ({
        onSubmit: submitKeys,
        retryEvent,
      }),
      [submitKeys, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <AddKeysFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </AddKeysFormDataContext.Provider>
    </FormProvider>
  );
};
