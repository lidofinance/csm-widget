import { type FC, type PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type CuratedOperatorFormInputType } from './types';
import { useCuratedOperatorFlowResolver } from './use-curated-operator-flow';
import { useCuratedOperatorDefaultValues } from './use-curated-operator-default-values';
import { useCuratedOperatorValidation } from './use-curated-operator-validation';

export const CuratedOperatorFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useCuratedOperatorValidation();
  const defaultValues = useCuratedOperatorDefaultValues();

  const formObject = useForm<CuratedOperatorFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useCuratedOperatorFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="createCuratedOperator"
      >
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
