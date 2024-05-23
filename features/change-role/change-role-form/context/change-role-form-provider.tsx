import { ROLES } from 'consts/roles';
import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  useFormControllerRetry,
} from 'shared/hook-form/form-controller';
import { ChangeRoleFormDataContext } from './change-role-form-context';
import { type ChangeRoleFormInputType } from './types';
import { useChangeRole } from './use-change-role';
import { useChangeRoleFormNetworkData } from './use-change-role-form-network-data';

export const ChangeRoleFormProvider: FC<PropsWithChildren<{ role: ROLES }>> = ({
  children,
  role,
}) => {
  const networkData = useChangeRoleFormNetworkData({ role });

  const formObject = useForm<ChangeRoleFormInputType>({
    defaultValues: {
      role,
    },
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { changeRole } = useChangeRole({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<ChangeRoleFormInputType> =
    useMemo(
      () => ({
        onSubmit: changeRole,
        retryEvent,
      }),
      [changeRole, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <ChangeRoleFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </ChangeRoleFormDataContext.Provider>
    </FormProvider>
  );
};
