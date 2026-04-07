import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesStealingCancel } from '../hooks/use-tx-modal-stages-stealing-cancel';
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

  const resolve = useStealingCancelFlowResolver();
  const { buildCallback } = useTxModalStagesStealingCancel();
  const submitter = useFlowSubmit(resolve, buildCallback);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="stealingCancel">
        <StealingCancelUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
