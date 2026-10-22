import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  type FormSubmitter,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import type {
  TopUpAllocationFormInputType,
  TopUpAllocationFormNetworkData,
} from './types';
import { useTopUpAllocationFlowResolver } from './use-top-up-allocation-flow';

export const TopUpAllocationFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const defaultValues = useFormDefaultValues<
    TopUpAllocationFormInputType,
    TopUpAllocationFormNetworkData
  >((data) => ({ enabled: data.enabled }));

  const formObject = useForm<TopUpAllocationFormInputType>({
    defaultValues,
    mode: 'onChange',
  });
  const { reset } = formObject;

  const flowSubmit = useFlowSubmit(useTopUpAllocationFlowResolver());

  // The toggle flips optimistically; a cancelled or failed submit must put it back
  const submitter: FormSubmitter<
    TopUpAllocationFormInputType,
    TopUpAllocationFormNetworkData
  > = useCallback(
    async (input, data, options) => {
      const success = await flowSubmit(input, data, options);
      if (!success) reset({ enabled: data.enabled });
      return success;
    },
    [flowSubmit, reset],
  );

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="topUpAllocation"
        onReset={reset}
      >
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
