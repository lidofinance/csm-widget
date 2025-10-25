import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { ChangeRoleFormInfo } from './change-role-form-info';
import {
  ChangeRoleDataProvider,
  ChangeRoleDataProviderProps,
  ChangeRoleFormProvider,
} from './context';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';

// TODO: update layout title/subtitle
export const ChangeRoleForm: FC<ChangeRoleDataProviderProps> = memo((props) => {
  return (
    <ChangeRoleDataProvider {...props}>
      <ChangeRoleFormProvider {...props}>
        <FormBlock data-testid="changeRoleForm">
          <FormLoader>
            <Form>
              <Info />
              <AddressInput />
              <SubmitButton />
            </Form>
            <ChangeRoleFormInfo />
          </FormLoader>
        </FormBlock>
      </ChangeRoleFormProvider>
    </ChangeRoleDataProvider>
  );
});
