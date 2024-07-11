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
  RemoveKeysFormDataContextValue,
  type RemoveKeysFormInputType,
} from './types';
import { useGetDefaultValues } from './use-get-default-values';
import { useRemoveKeysFormNetworkData } from './use-remove-keys-form-network-data';
import { useRemoveKeysSubmit } from './use-remove-keys-submit';

export const useRemoveKeysFormData =
  useFormData<RemoveKeysFormDataContextValue>;

export const RemoveKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useRemoveKeysFormNetworkData();

  const { getDefaultValues } = useGetDefaultValues(networkData);

  const formObject = useForm<RemoveKeysFormInputType>({
    defaultValues: getDefaultValues,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const removeKeys = useRemoveKeysSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    RemoveKeysFormInputType,
    RemoveKeysFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: removeKeys,
      retryEvent,
    }),
    [removeKeys, retryEvent],
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
