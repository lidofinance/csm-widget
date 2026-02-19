import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import type {
  OperatorInfoFormInputType,
  OperatorInfoFormNetworkData,
} from './types';
import { useOperatorInfoSubmit } from './use-operator-info-submit';
import { useOperatorInfoValidation } from './use-operator-info-validation';

export const OperatorInfoFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useOperatorInfoValidation();

  const defaultValues = useFormDefaultValues<
    OperatorInfoFormInputType,
    OperatorInfoFormNetworkData
  >((data) => ({
    name: data.currentName ?? '',
    description: data.currentDescription ?? '',
  }));

  const formObject = useForm<OperatorInfoFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useOperatorInfoSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="operatorInfo">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
