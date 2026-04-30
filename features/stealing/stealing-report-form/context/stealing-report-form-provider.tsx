import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type StealingReportFormInputType } from './types';
import { useStealingReportFlowResolver } from './use-stealing-report-flow';
import { useStealingReportValidation } from './use-stealing-report-validation';

export const StealingReportFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useStealingReportValidation();

  const formObject = useForm<StealingReportFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useStealingReportFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="stealingReport">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
