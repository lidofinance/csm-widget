import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import {
  StealingReportFormNetworkData,
  type StealingReportFormInputType,
} from './types';
import { useStealingReportFormNetworkData } from './use-stealing-report-form-network-data';
import { useStealingReportSubmit } from './use-stealing-report-submit';
import { useStealingReportValidation } from './use-stealing-report-validation';

export const useStealingReportFormData =
  useFormData<StealingReportFormNetworkData>;

export const StealingReportFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [networkData, revalidate] = useStealingReportFormNetworkData();
  const validationResolver = useStealingReportValidation(networkData);

  // TODO: validate (max amount)
  const formObject = useForm<StealingReportFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { stealingReport } = useStealingReportSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    StealingReportFormInputType,
    StealingReportFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: stealingReport,
      retryEvent,
    }),
    [stealingReport, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
