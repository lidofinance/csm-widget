import { FC, memo } from 'react';

import { AcceptInviteFormProvider } from './context';

import { AcceptInviteFormInfo } from './accept-invite-form-info';
import { AcceptInviteHat } from './accept-invite-hat';
import { SubmitButton } from './controls/submit-button';
import { AcceptInviteBlock, FormControllerStyled } from './styles';
import { InviteSelector } from './controls/invite-selector';

export const AcceptInviteForm: FC = memo(() => {
  return (
    <AcceptInviteFormProvider>
      <AcceptInviteHat />
      <AcceptInviteBlock>
        <FormControllerStyled>
          <InviteSelector />
          <SubmitButton />
        </FormControllerStyled>
        <AcceptInviteFormInfo />
      </AcceptInviteBlock>
    </AcceptInviteFormProvider>
  );
});
