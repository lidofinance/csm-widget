import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { StealingCancelUpdater } from './stealing-cancel-updater';
import { type StealingCancelFormInputType } from './types';
import { useStealingCancelFlowResolver } from './use-stealing-cancel-flow';
import { useStealingCancelValidation } from './use-stealing-cancel-validation';

export const StealingCancelFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useStealingCancelValidation();

  const formObject = useForm<StealingCancelFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useStealingCancelFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="stealingCancel">
        <StealingCancelUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
