import { ROLES } from '@lidofinance/lido-csm-sdk';
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
  type ChangeRoleFormInputType,
  type ChangeRoleFormNetworkData,
} from './types';
import { useChangeRoleFormNetworkData } from './use-change-role-form-network-data';
import { useChangeRoleSubmit } from './use-change-role-submit';
import { useChangeRoleValidation } from './use-change-role-validation';
import { useGetDefaultValues } from './use-get-default-values';

export const useChangeRoleFormData = useFormData<ChangeRoleFormNetworkData>;

export type ChangeRoleFormProviderProps = { role: ROLES };

export const ChangeRoleFormProvider: FC<
  PropsWithChildren<ChangeRoleFormProviderProps>
> = ({ children, role }) => {
  const [networkData, revalidate] = useChangeRoleFormNetworkData({ role });
  const validationResolver = useChangeRoleValidation(networkData);

  const asyncDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<ChangeRoleFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { changeRole } = useChangeRoleSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    ChangeRoleFormInputType,
    ChangeRoleFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: changeRole,
      retryEvent,
    }),
    [changeRole, retryEvent],
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
