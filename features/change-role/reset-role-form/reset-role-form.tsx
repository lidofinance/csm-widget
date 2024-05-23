import { FC, memo } from 'react';

import { ResetRoleFormProvider } from './context';

import { ResetRoleFormInfo } from './reset-role-form-info';
import { SubmitButton } from './controls/submit-button';
import { ResetRoleHat } from './reset-role-hat';
import { ResetRoleBlock, FormControllerStyled } from './styles';

export const ResetRoleForm: FC = memo(() => {
  return (
    <ResetRoleFormProvider>
      <ResetRoleHat />
      <ResetRoleBlock>
        <FormControllerStyled>
          <SubmitButton />
        </FormControllerStyled>
        <ResetRoleFormInfo />
      </ResetRoleBlock>
    </ResetRoleFormProvider>
  );
});
