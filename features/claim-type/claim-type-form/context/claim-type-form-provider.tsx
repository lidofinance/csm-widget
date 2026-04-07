import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesClaimType } from '../hooks/use-tx-modal-stages-claim-type';
import { type ClaimTypeFormInputType } from './types';
import { useClaimTypeFlowResolver } from './use-claim-type-flow';
import { useClaimTypeValidation } from './use-claim-type-validation';

export const ClaimTypeFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimTypeValidation();

  const formObject = useForm<ClaimTypeFormInputType>({
    resolver,
    mode: 'onChange',
  });

  const resolve = useClaimTypeFlowResolver();
  const { buildCallback } = useTxModalStagesClaimType();
  const submitter = useFlowSubmit(resolve, buildCallback);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="claimType">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
