import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  useFormControllerRetry,
} from 'shared/hook-form/form-controller';
import { AcceptInviteFormDataContext } from './accept-invite-form-context';
import { type AcceptInviteFormInputType } from './types';
import { useAcceptInvite } from './use-accept-invite';
import { useAcceptInviteFormNetworkData } from './use-accept-invite-form-network-data';
import { useGetDefaultValues } from './use-get-default-values';

export const AcceptInviteFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useAcceptInviteFormNetworkData();

  // FIXME: not work
  const getDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<AcceptInviteFormInputType>({
    defaultValues: getDefaultValues,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { acceptInvite } = useAcceptInvite({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<AcceptInviteFormInputType> =
    useMemo(
      () => ({
        onSubmit: acceptInvite,
        retryEvent,
      }),
      [acceptInvite, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <AcceptInviteFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </AcceptInviteFormDataContext.Provider>
    </FormProvider>
  );
};
