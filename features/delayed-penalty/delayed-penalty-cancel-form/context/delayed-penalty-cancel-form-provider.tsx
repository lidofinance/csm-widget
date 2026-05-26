import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { DelayedPenaltyCancelUpdater } from './delayed-penalty-cancel-updater';
import { type DelayedPenaltyCancelFormInputType } from './types';
import { useDelayedPenaltyCancelFlowResolver } from './use-delayed-penalty-cancel-flow';
import { useDelayedPenaltyCancelValidation } from './use-delayed-penalty-cancel-validation';

export const DelayedPenaltyCancelFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useDelayedPenaltyCancelValidation();

  const formObject = useForm<DelayedPenaltyCancelFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useDelayedPenaltyCancelFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="delayedPenaltyCancel"
      >
        <DelayedPenaltyCancelUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
