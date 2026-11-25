import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { ChangeRoleFormGate } from './change-role-form-gate';
import {
  ChangeRoleDataProvider,
  ChangeRoleDataProviderProps,
  ChangeRoleFormProvider,
} from './context';

export const ChangeRoleForm: FC<ChangeRoleDataProviderProps> = memo((props) => {
  const faq = useFaq('ROLES');

  return (
    <ChangeRoleDataProvider {...props}>
      <ChangeRoleFormProvider {...props}>
        <FormPage>
          <FormReady>
            <ChangeRoleFormGate />
          </FormReady>
          <Faq items={faq} />
        </FormPage>
      </ChangeRoleFormProvider>
    </ChangeRoleDataProvider>
  );
});
