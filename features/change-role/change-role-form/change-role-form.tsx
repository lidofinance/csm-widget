import { FC, memo } from 'react';

import { ChangeRoleFormProvider } from './context';

import { ChangeRoleFormInfo } from './change-role-form-info';
import { SubmitButton } from './controls/submit-button';
import { ChangeRoleHat } from './change-role-hat';
import { ChangeRoleBlock, FormControllerStyled } from './styles';
import { AddressInput } from './controls/address-input';
import { ROLES } from 'consts/roles';

export const ChangeRoleForm: FC<{ role: ROLES }> = memo(({ role }) => {
  return (
    <ChangeRoleFormProvider role={role}>
      <ChangeRoleHat />
      <ChangeRoleBlock>
        <FormControllerStyled>
          <AddressInput />
          <SubmitButton />
        </FormControllerStyled>
        <ChangeRoleFormInfo />
      </ChangeRoleBlock>
    </ChangeRoleFormProvider>
  );
});
