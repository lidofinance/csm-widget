import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { SplitsFormInputType, SplitsFormNetworkData } from './types';
import { useSplitsSubmit } from './use-splits-submit';
import { useSplitsValidation } from './use-splits-validation';
import { SplitsShareTrigger } from './splits-share-trigger';

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

  const submitter = useSplitsSubmit();

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
