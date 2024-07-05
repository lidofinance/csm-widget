import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
} from 'shared/hook-form/form-controller';
import { type ResetRoleFormInputType } from './types';
import { useResetRoleFormNetworkData } from './use-reset-role-form-network-data';
import { useResetRoleSubmit } from './use-reset-role-submit';

import { useFormData } from 'shared/hook-form/form-controller';
import { type ResetRoleFormDataContextValue } from './types';
import { useAccount } from 'shared/hooks';

export const useResetRoleFormData = useFormData<ResetRoleFormDataContextValue>;

export const ResetRoleFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();
  const networkData = useResetRoleFormNetworkData();

  const formObject = useForm<ResetRoleFormInputType>({
    defaultValues: {
      address,
    },
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { resetRole } = useResetRoleSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    ResetRoleFormInputType,
    ResetRoleFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: resetRole,
      retryEvent,
    }),
    [resetRole, retryEvent],
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
