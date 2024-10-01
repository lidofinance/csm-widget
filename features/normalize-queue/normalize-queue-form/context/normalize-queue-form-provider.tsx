import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import {
  NormalizeQueueFormNetworkData,
  type NormalizeQueueFormInputType,
} from './types';
import { useNormalizeQueueFormNetworkData } from './use-normalize-queue-form-network-data';
import { useNormalizeQueueSubmit } from './use-normalize-queue-submit';
import { useNormalizeQueueValidation } from './use-normalize-queue-validation';

export const useNormalizeQueueFormData =
  useFormData<NormalizeQueueFormNetworkData>;

export const NormalizeQueueFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [networkData, revalidate] = useNormalizeQueueFormNetworkData();
  const validationResolver = useNormalizeQueueValidation(networkData);

  // TODO: validate (max amount)
  const formObject = useForm<NormalizeQueueFormInputType>({
    defaultValues: {},
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { normalizeQueue } = useNormalizeQueueSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    NormalizeQueueFormInputType,
    NormalizeQueueFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: normalizeQueue,
      retryEvent,
    }),
    [normalizeQueue, retryEvent],
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
