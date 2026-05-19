import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type ClaimIcsFormInputType } from './types';
import { useClaimIcsFlowResolver } from './use-claim-ics-flow';
import { useClaimIcsValidation } from './use-claim-ics-validation';

export const ClaimIcsFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimIcsValidation();

  const formObject = useForm<ClaimIcsFormInputType>({
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useClaimIcsFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="claimIcs">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
