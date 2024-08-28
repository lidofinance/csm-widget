import { FC, memo } from 'react';
import { AcceptInviteFormInfo } from './accept-invite-form-info';
import { AcceptInviteFormProvider } from './context';
import { InviteSelector } from './controls/invite-selector';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { AcceptInviteFormLoader } from './accept-invite-form-loader';

export const AcceptInviteForm: FC = memo(() => {
  return (
    <AcceptInviteFormProvider>
      <FormBlock>
        <AcceptInviteFormLoader>
          <FormControllerStyled>
            <InviteSelector />
            <SubmitButton />
          </FormControllerStyled>
          <AcceptInviteFormInfo />
        </AcceptInviteFormLoader>
      </FormBlock>
    </AcceptInviteFormProvider>
  );
});
