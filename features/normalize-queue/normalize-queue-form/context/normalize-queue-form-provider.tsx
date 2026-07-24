import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type NormalizeQueueFormInputType } from './types';
import { useNormalizeQueueFlowResolver } from './use-normalize-queue-flow';
import { useNormalizeQueueValidation } from './use-normalize-queue-validation';

export const NormalizeQueueFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useNormalizeQueueValidation();

  const formObject = useForm<NormalizeQueueFormInputType>({
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useNormalizeQueueFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="normalizeQueue">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
