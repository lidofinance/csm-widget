import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { RemoveKeysFormDataContext } from './remove-keys-form-context';
import { type RemoveKeysFormInputType } from './types';
import { useGetDefaultValues } from './use-get-default-values';
import { useRemoveKeys } from './use-remove-keys';
import { useRemoveKeysFormNetworkData } from './use-remove-keys-form-network-data';
import { useRemoveKeysFormValidationContext } from './use-remove-keys-form-validation-context';

export const RemoveKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useRemoveKeysFormNetworkData();
  const validationContextPromise =
    useRemoveKeysFormValidationContext(networkData);

  const { getDefaultValues } = useGetDefaultValues(networkData);

  const formObject = useForm<RemoveKeysFormInputType>({
    defaultValues: getDefaultValues,
    context: validationContextPromise,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const removeKeys = useRemoveKeys({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<RemoveKeysFormInputType> =
    useMemo(
      () => ({
        onSubmit: removeKeys,
        retryEvent,
      }),
      [removeKeys, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <RemoveKeysFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </RemoveKeysFormDataContext.Provider>
    </FormProvider>
  );
};
