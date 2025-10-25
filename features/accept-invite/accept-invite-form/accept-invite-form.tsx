import { FC, memo } from 'react';
import { AcceptInviteFormInfo } from './accept-invite-form-info';
import { AcceptInviteDataProvider, AcceptInviteFormProvider } from './context';
import { InviteSelector } from './controls/invite-selector';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { AcceptInviteFormLoader } from './accept-invite-form-loader';

export const AcceptInviteForm: FC = memo(() => {
  return (
    <AcceptInviteDataProvider>
      <AcceptInviteFormProvider>
        <FormBlock>
          <AcceptInviteFormLoader>
            <Form>
              <InviteSelector />
              <SubmitButton />
            </Form>
            <AcceptInviteFormInfo />
          </AcceptInviteFormLoader>
        </FormBlock>
      </AcceptInviteFormProvider>
    </AcceptInviteDataProvider>
  );
});
