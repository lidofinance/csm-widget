import { FC, memo } from 'react';

import { ChangeRoleFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { ChangeRoleFormInfo } from './change-role-form-info';
import { ChangeRoleFormProviderProps } from './context/change-role-form-provider';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';

export const ChangeRoleForm: FC<ChangeRoleFormProviderProps> = memo((props) => {
  return (
    <ChangeRoleFormProvider {...props}>
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
