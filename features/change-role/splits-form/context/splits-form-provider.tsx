import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { SplitsFormInputType, SplitsFormNetworkData } from './types';
import { useSplitsSubmit } from './use-splits-submit';
import { useSplitsValidation } from './use-splits-validation';

export const SplitsFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useSplitsValidation();

  const defaultValues = useFormDefaultValues<
    SplitsFormInputType,
    SplitsFormNetworkData
  >(({ currentFeeSplits }) => ({
    feeSplits: currentFeeSplits,
  }));

  const formObject = useForm<SplitsFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useSplitsSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="splits">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
