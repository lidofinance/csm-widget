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
  RemoveKeysFormNetworkData,
  type RemoveKeysFormInputType,
} from './types';
import { useGetDefaultValues } from './use-get-default-values';
import { useRemoveKeysFormNetworkData } from './use-remove-keys-form-network-data';
import { useRemoveKeysSubmit } from './use-remove-keys-submit';

export const useRemoveKeysFormData = useFormData<RemoveKeysFormNetworkData>;

export const RemoveKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useRemoveKeysFormNetworkData();

  const asyncDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<RemoveKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const removeKeys = useRemoveKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    RemoveKeysFormInputType,
    RemoveKeysFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: removeKeys,
      retryEvent,
    }),
    [removeKeys, retryEvent],
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
