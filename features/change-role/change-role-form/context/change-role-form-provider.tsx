import { ROLES } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import {
  ChangeRoleFormNetworkData,
  type ChangeRoleFormInputType,
} from './types';
import { useChangeRoleSubmit } from './use-change-role-submit';
import { useChangeRoleValidation } from './use-change-role-validation';

export type ChangeRoleFormProviderProps = { role: ROLES };

export const ChangeRoleFormProvider: FC<
  PropsWithChildren<ChangeRoleFormProviderProps>
> = ({ children }) => {
  const resolver = useChangeRoleValidation();

  const defaultValues = useFormDefaultValues<
    ChangeRoleFormInputType,
    ChangeRoleFormNetworkData
  >((data) => ({
    isRevoke: false,
    address: data.isManagerReset ? data.address : undefined,
  }));

  const formObject = useForm<ChangeRoleFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useChangeRoleSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
