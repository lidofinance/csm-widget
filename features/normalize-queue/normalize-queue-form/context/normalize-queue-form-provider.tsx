import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type NormalizeQueueFormInputType } from './types';
import { useNormalizeQueueFlowResolver } from './use-normalize-queue-flow';

export const NormalizeQueueFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const formObject = useForm<NormalizeQueueFormInputType>({
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
