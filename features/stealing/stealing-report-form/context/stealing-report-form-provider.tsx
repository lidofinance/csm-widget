import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type StealingReportFormInputType } from './types';
import { useStealingReportSubmit } from './use-stealing-report-submit';
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

  const submitter = useStealingReportSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="stealingReport">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
