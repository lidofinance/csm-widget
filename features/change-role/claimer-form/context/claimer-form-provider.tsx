import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { ClaimerFormNetworkData, type ClaimerFormInputType } from './types';
import { useClaimerSubmit } from './use-claimer-submit';
import { useClaimerValidation } from './use-claimer-validation';

export const ClaimerFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimerValidation();

  const defaultValues = useFormDefaultValues<
    ClaimerFormInputType,
    ClaimerFormNetworkData
  >(() => ({
    isUnset: false,
    address: undefined,
  }));

  const formObject = useForm<ClaimerFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useClaimerSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="claimer">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
