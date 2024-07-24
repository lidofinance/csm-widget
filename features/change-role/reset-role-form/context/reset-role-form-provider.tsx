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
import { type ResetRoleFormNetworkData } from './types';
import { useAccount } from 'shared/hooks';

export const useResetRoleFormData = useFormData<ResetRoleFormNetworkData>;

export const ResetRoleFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();
  const [networkData, revalidate] = useResetRoleFormNetworkData();

  const formObject = useForm<ResetRoleFormInputType>({
    defaultValues: {
      address,
    },
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { resetRole } = useResetRoleSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    ResetRoleFormInputType,
    ResetRoleFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: resetRole,
      retryEvent,
    }),
    [resetRole, retryEvent],
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
