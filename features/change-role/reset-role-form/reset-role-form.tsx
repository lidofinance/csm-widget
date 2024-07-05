import { FC, memo } from 'react';

import { ResetRoleFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { ResetRoleFormInfo } from './reset-role-form-info';

export const ResetRoleForm: FC = memo(() => {
  return (
    <ResetRoleFormProvider>
      <FormBlock>
        <FormControllerStyled>
          <Info />
          <AddressInput />
          <SubmitButton />
        </FormControllerStyled>
        <ResetRoleFormInfo />
      </FormBlock>
    </ResetRoleFormProvider>
  );
});
