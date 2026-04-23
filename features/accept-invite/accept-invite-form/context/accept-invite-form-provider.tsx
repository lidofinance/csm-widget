import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import {
  AcceptInviteFormNetworkData,
  type AcceptInviteFormInputType,
} from './types';
import { useAcceptInviteFlowResolver } from './use-accept-invite-flow';
import { useAcceptInviteValidation } from './use-accept-invite-validation';

export const AcceptInviteFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const defaultValues = useFormDefaultValues<
    AcceptInviteFormInputType,
    AcceptInviteFormNetworkData
  >((data) => ({
    invite: data.invites[0],
  }));

  const resolver = useAcceptInviteValidation();

  const formObject = useForm<AcceptInviteFormInputType>({
    defaultValues,
    mode: 'onChange',
    resolver,
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
