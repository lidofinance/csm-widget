import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { SplitsShareTrigger } from './splits-share-trigger';
import { SplitsFormInputType, SplitsFormNetworkData } from './types';
import { useSplitsFlowResolver } from './use-splits-flow';
import { useSplitsValidation } from './use-splits-validation';

export const SplitsFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useSplitsValidation();

  const defaultValues = useFormDefaultValues<
    SplitsFormInputType,
    SplitsFormNetworkData
  >(({ currentFeeSplits }) => ({
    isEditing: false,
    feeSplits: currentFeeSplits,
    totalShare: 0n,
  }));

  const formObject = useForm<SplitsFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const resolve = useSplitsFlowResolver();
  const submitter = useFlowSubmit(resolve);

  const handleReset = useCallback(
    (args: SplitsFormInputType) => {
      formObject.reset({ ...args, isEditing: false });
    },
    [formObject],
  );

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="splits"
        onReset={handleReset}
      >
        <SplitsShareTrigger />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
