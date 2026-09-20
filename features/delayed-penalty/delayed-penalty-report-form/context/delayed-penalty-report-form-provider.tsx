import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type DelayedPenaltyReportFormInputType } from './types';
import { useDelayedPenaltyReportFlowResolver } from './use-delayed-penalty-report-flow';
import { useDelayedPenaltyReportValidation } from './use-delayed-penalty-report-validation';

export const DelayedPenaltyReportFormProvider: FC<
  PropsWithChildren<{ module?: MODULE_NAME }>
> = ({ children, module }) => {
  const resolver = useDelayedPenaltyReportValidation();

  const formObject = useForm<DelayedPenaltyReportFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useDelayedPenaltyReportFlowResolver(module));

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="delayedPenaltyReport"
      >
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
