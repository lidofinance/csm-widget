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
  StealingCancelFormNetworkData,
  type StealingCancelFormInputType,
} from './types';
import { useStealingCancelFormNetworkData } from './use-stealing-cancel-form-network-data';
import { useStealingCancelSubmit } from './use-stealing-cancel-submit';
import { useStealingCancelValidation } from './use-stealing-cancel-validation';
import { useFormMaxAmount } from './use-form-max-amount';

export const useStealingCancelFormData =
  useFormData<StealingCancelFormNetworkData>;

export const StealingCancelFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [networkData, revalidate] = useStealingCancelFormNetworkData();
  const validationResolver = useStealingCancelValidation(networkData);

  // TODO: validate (max amount)
  const formObject = useForm<StealingCancelFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormMaxAmount(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { stealingCancel } = useStealingCancelSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    StealingCancelFormInputType,
    StealingCancelFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: stealingCancel,
      retryEvent,
    }),
    [stealingCancel, retryEvent],
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
