import { ROLES } from 'consts/roles';
import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
} from 'shared/hook-form/form-controller';
import { type ChangeRoleFormInputType } from './types';
import { useChangeRoleSubmit } from './use-change-role-submit';
import { useChangeRoleFormNetworkData } from './use-change-role-form-network-data';
import { useChangeRoleFormValidationContext } from './use-change-role-form-validation-context';
import { changeRoleFormValidationResolver } from './validation';

import { type ChangeRoleFormDataContextValue } from './types';
import { useFormData } from 'shared/hook-form/form-controller';

export const useChangeRoleFormData =
  useFormData<ChangeRoleFormDataContextValue>;

export type ChangeRoleFormProviderProps = { role: ROLES };

export const ChangeRoleFormProvider: FC<
  PropsWithChildren<ChangeRoleFormProviderProps>
> = ({ children, role }) => {
  const networkData = useChangeRoleFormNetworkData({ role });
  const validationContextPromise =
    useChangeRoleFormValidationContext(networkData);

  const formObject = useForm<ChangeRoleFormInputType>({
    defaultValues: {
      isRevoke: false,
    },
    resolver: changeRoleFormValidationResolver,
    context: validationContextPromise,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { changeRole } = useChangeRoleSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    ChangeRoleFormInputType,
    ChangeRoleFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: changeRole,
      retryEvent,
    }),
    [changeRole, retryEvent],
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
