import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  useFormControllerRetry,
} from 'shared/hook-form/form-controller';
import { ResetRoleFormDataContext } from './reset-role-form-context';
import { type ResetRoleFormInputType } from './types';
import { useResetRole } from './use-reset-role';
import { useResetRoleFormNetworkData } from './use-reset-role-form-network-data';

export const ResetRoleFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useResetRoleFormNetworkData();

  const formObject = useForm<ResetRoleFormInputType>({
    defaultValues: {},
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { resetRole } = useResetRole({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<ResetRoleFormInputType> =
    useMemo(
      () => ({
        onSubmit: resetRole,
        retryEvent,
      }),
      [resetRole, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <ResetRoleFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </ResetRoleFormDataContext.Provider>
    </FormProvider>
  );
};
