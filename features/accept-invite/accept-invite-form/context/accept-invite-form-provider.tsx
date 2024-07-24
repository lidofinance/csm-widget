import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import {
  AcceptInviteFormNetworkData,
  type AcceptInviteFormInputType,
} from './types';
import { useAcceptInviteFormNetworkData } from './use-accept-invite-form-network-data';
import { useAcceptInviteSubmit } from './use-accept-invite-submit';
import { useGetDefaultValues } from './use-get-default-values';

export const useAcceptInviteFormData = useFormData<AcceptInviteFormNetworkData>;

export const AcceptInviteFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [networkData, revalidate] = useAcceptInviteFormNetworkData();

  // FIXME: not work ??
  const getDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<AcceptInviteFormInputType>({
    defaultValues: getDefaultValues,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { acceptInvite } = useAcceptInviteSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

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
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
