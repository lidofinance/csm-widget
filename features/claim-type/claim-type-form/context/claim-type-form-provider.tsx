import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type ClaimTypeFormInputType } from './types';
import { useClaimTypeSubmit } from './use-claim-type-submit';
import { useClaimTypeValidation } from './use-claim-type-validation';

export const ClaimTypeFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimTypeValidation();

  const formObject = useForm<ClaimTypeFormInputType>({
    resolver,
    mode: 'onChange',
  });

  const submitter = useClaimTypeSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="claimType">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
