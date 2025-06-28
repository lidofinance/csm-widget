import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { EjectKeysFormNetworkData, type EjectKeysFormInputType } from './types';
import { useGetDefaultValues } from './use-get-default-values';
import { useEjectKeysSubmit } from './use-eject-keys-submit';
import { useEjectKeysFormNetworkData } from './use-eject-keys-form-network-data';
import { useEjectKeysValidation } from './use-eject-keys-validation';

export const useEjectKeysFormData = useFormData<EjectKeysFormNetworkData>;

export const EjectKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useEjectKeysFormNetworkData();
  const validationResolver = useEjectKeysValidation();

  const asyncDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<EjectKeysFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const ejectKeys = useEjectKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    EjectKeysFormInputType,
    EjectKeysFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: ejectKeys,
      retryEvent,
    }),
    [ejectKeys, retryEvent],
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
