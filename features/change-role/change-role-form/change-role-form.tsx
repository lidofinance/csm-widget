import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { ChangeRoleFormGate } from './change-role-form-gate';
import {
  ChangeRoleDataProvider,
  ChangeRoleDataProviderProps,
  ChangeRoleFormProvider,
} from './context';

export const ChangeRoleForm: FC<ChangeRoleDataProviderProps> = memo((props) => {
  const faq = useFaq('ROLES');

  return (
    <AppFormUi>
      <ChangeRoleDataProvider {...props}>
        <ChangeRoleFormProvider {...props}>
          <FormPage faq={<Faq items={faq} />}>
            <FormReady>
              <ChangeRoleFormGate />
            </FormReady>
          </FormPage>
        </ChangeRoleFormProvider>
      </ChangeRoleDataProvider>
    </AppFormUi>
  );
});
