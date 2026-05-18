import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type ClaimIdvtcFormInputType } from './types';
import { useClaimIdvtcFlowResolver } from './use-claim-idvtc-flow';
import { useClaimIdvtcValidation } from './use-claim-idvtc-validation';

export const ClaimIdvtcFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimIdvtcValidation();

  const formObject = useForm<ClaimIdvtcFormInputType>({
    resolver,
    mode: 'onChange',
    defaultValues: { mode: 'upgrade' },
  });

  const submitter = useFlowSubmit(useClaimIdvtcFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="claimIdvtc">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
