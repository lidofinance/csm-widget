import { type FC, type PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type CuratedOperatorFormInputType } from './types';
import { useCuratedOperatorDefaultValues } from './use-curated-operator-default-values';
import { useCuratedOperatorSubmit } from './use-curated-operator-submit';
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

  const submitter = useCuratedOperatorSubmit();

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
