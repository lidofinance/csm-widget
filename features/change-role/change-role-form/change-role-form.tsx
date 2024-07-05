import { FC, memo } from 'react';

import { ChangeRoleFormProvider } from './context';

import { ROLES } from 'consts/roles';
import { ChangeRoleFormInfo } from './change-role-form-info';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

export const ChangeRoleForm: FC<{ role: ROLES }> = memo(({ role }) => {
  return (
    <ChangeRoleFormProvider role={role}>
      <FormBlock>
        <FormControllerStyled>
          <Info />
          <AddressInput />
          <SubmitButton />
        </FormControllerStyled>
        <ChangeRoleFormInfo />
      </FormBlock>
    </ChangeRoleFormProvider>
  );
});
