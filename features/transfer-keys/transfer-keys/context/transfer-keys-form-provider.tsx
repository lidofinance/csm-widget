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
  TransferKeysFormNetworkData,
  type TransferKeysFormInputType,
} from './types';
import { useTransferKeysFormNetworkData } from './use-transfer-keys-form-network-data';
import { useTransferKeysSubmit } from './use-transfer-keys-submit';

export const useTransferKeysFormData = useFormData<TransferKeysFormNetworkData>;

export const TransferKeysFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [networkData, revalidate] = useTransferKeysFormNetworkData();

  const formObject = useForm<TransferKeysFormInputType>({
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const transferKeys = useTransferKeysSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    TransferKeysFormInputType,
    TransferKeysFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: transferKeys,
      retryEvent,
    }),
    [transferKeys, retryEvent],
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
