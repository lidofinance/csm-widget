import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { type AcceptInviteFormInputType } from './types';
import { useAcceptInviteFlowResolver } from './use-accept-invite-flow';

export const AcceptInviteFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const formObject = useForm<AcceptInviteFormInputType>({
    defaultValues: { intent: undefined },
  });

  const submitter = useFlowSubmit(useAcceptInviteFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="acceptInvite">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
