import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { ClaimBondUpdater } from './claim-bond-updater';
import { type ClaimBondFormInputType } from './types';
import { useClaimBondFlowResolver } from './use-claim-bond-flow';
import { useClaimBondDefaultValues } from './use-claim-bond-default-values';
import { useClaimBondValidation } from './use-claim-bond-validation';

export const ClaimBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimBondValidation();
  const defaultValues = useClaimBondDefaultValues();

  const formObject = useForm<ClaimBondFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useClaimBondFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="claimBond"
        // onReset={formObject.reset}
      >
        <ClaimBondUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
