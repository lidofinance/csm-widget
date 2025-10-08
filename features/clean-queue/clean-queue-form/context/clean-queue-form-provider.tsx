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
  CleanQueueFormNetworkData,
  type CleanQueueFormInputType,
} from './types';
import { useCleanQueueFormNetworkData } from './use-clean-queue-form-network-data';
import { useCleanQueueSubmit } from './use-clean-queue-submit';

export const useCleanQueueFormData = useFormData<CleanQueueFormNetworkData>;

export const CleanQueueFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useCleanQueueFormNetworkData();

  const formObject = useForm<CleanQueueFormInputType>({
    defaultValues: {},
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { cleanQueue } = useCleanQueueSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    CleanQueueFormInputType,
    CleanQueueFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: cleanQueue,
      retryEvent,
    }),
    [cleanQueue, retryEvent],
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
