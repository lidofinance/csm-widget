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
  AcceptInviteFormDataContextValue,
  type AcceptInviteFormInputType,
} from './types';
import { useAcceptInviteFormNetworkData } from './use-accept-invite-form-network-data';
import { useAcceptInviteSubmit } from './use-accept-invite-submit';
import { useGetDefaultValues } from './use-get-default-values';

export const useAcceptInviteFormData =
  useFormData<AcceptInviteFormDataContextValue>;

export const AcceptInviteFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useAcceptInviteFormNetworkData();

  // FIXME: not work ??
  const getDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<AcceptInviteFormInputType>({
    defaultValues: getDefaultValues,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { acceptInvite } = useAcceptInviteSubmit({
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
      <FormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
