import { FC, memo } from 'react';
import { AcceptInviteFormInfo } from './accept-invite-form-info';
import { AcceptInviteFormProvider } from './context';
import { InviteSelector } from './controls/invite-selector';
import { SubmitButton } from './controls/submit-button';
import { FormLoading } from './form-loading';
import { AcceptInviteBlock, FormControllerStyled } from './styles';

export const AcceptInviteForm: FC = memo(() => {
  return (
    <AcceptInviteFormProvider>
      <AcceptInviteBlock>
        <FormLoading>
          <FormControllerStyled>
            <InviteSelector />
            <SubmitButton />
          </FormControllerStyled>
          <AcceptInviteFormInfo />
        </FormLoading>
      </AcceptInviteBlock>
    </AcceptInviteFormProvider>
  );
});
