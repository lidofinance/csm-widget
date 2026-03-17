import { FC, memo } from 'react';

import { PATH } from 'consts/urls';
import { BackButton, FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { ChangeRoleFormLoader } from './change-role-form-loader';
import { ChangeRoleFormInfo } from './change-role-form-info';
import {
  ChangeRoleDataProvider,
  ChangeRoleDataProviderProps,
  ChangeRoleFormProvider,
} from './context';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';

export const ChangeRoleForm: FC<ChangeRoleDataProviderProps> = memo((props) => {
  return (
    <ChangeRoleDataProvider {...props}>
      <ChangeRoleFormProvider {...props}>
        <FormBlock data-testid="changeRoleForm">
          <BackButton text="Back to all roles" href={PATH.SETTINGS} />
          <ChangeRoleFormLoader>
            <Form>
              <Info />
              <AddressInput />
              <SubmitButton />
            </Form>
            <ChangeRoleFormInfo />
          </ChangeRoleFormLoader>
        </FormBlock>
      </ChangeRoleFormProvider>
    </ChangeRoleDataProvider>
  );
});
