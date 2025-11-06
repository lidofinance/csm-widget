import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { ClaimBondUpdater } from './claim-bond-updater';
import { type ClaimBondFormInputType } from './types';
import { useClaimBondDefaultValues } from './use-claim-bond-default-values';
import { useClaimBondSubmit } from './use-claim-bond-submit';
import { useClaimBondValidation } from './use-claim-bond-validation';

export const ClaimBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimBondValidation();
  const defaultValues = useClaimBondDefaultValues();

  const formObject = useForm<ClaimBondFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useClaimBondSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        <ClaimBondUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
