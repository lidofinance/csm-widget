import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type EnableTopUpAllocationFormInputType } from './types';
import { useEnableTopUpAllocationFlowResolver } from './use-enable-top-up-allocation-flow';
import { useEnableTopUpAllocationValidation } from './use-enable-top-up-allocation-validation';

export const EnableTopUpAllocationFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useEnableTopUpAllocationValidation();

  const formObject = useForm<EnableTopUpAllocationFormInputType>({
    defaultValues: {
      nodeOperatorId: undefined,
    },
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useEnableTopUpAllocationFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="enableTopUpAllocation"
      >
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
