import { ROLES } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { useChangeRoleMode } from 'shared/hooks';
import {
  ChangeRoleFormNetworkData,
  type ChangeRoleFormInputType,
} from './types';
import { useChangeRoleFlowResolver } from './use-change-role-flow';
import { useChangeRoleValidation } from './use-change-role-validation';

export type ChangeRoleFormProviderProps = { role: ROLES };

export const ChangeRoleFormProvider: FC<
  PropsWithChildren<ChangeRoleFormProviderProps>
> = ({ children, role }) => {
  const mode = useChangeRoleMode(role);
  const resolver = useChangeRoleValidation(role);

  const defaultValues = useFormDefaultValues<
    ChangeRoleFormInputType,
    ChangeRoleFormNetworkData
  >((data) => ({
    isRevoke: false,
    address: mode === 'managerReset' ? data.address : undefined,
  }));

  const formObject = useForm<ChangeRoleFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const resolve = useChangeRoleFlowResolver(role);
  const submitter = useFlowSubmit(resolve);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="changeRole">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
