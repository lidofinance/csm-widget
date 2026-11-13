import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AcceptInviteFormGate } from './accept-invite-form-gate';
import { AcceptInviteDataProvider, AcceptInviteFormProvider } from './context';
import { InviteCards } from './controls/invite-cards';

export const AcceptInviteForm: FC = memo(() => {
  const faq = useFaq('ROLES');

  return (
    <AcceptInviteDataProvider>
      <AcceptInviteFormProvider>
        <FormPage faq={<Faq items={faq} />}>
          <FormReady>
            <AcceptInviteFormGate>
              <Form data-testid="acceptInviteForm">
                <InviteCards />
              </Form>
            </AcceptInviteFormGate>
          </FormReady>
        </FormPage>
      </AcceptInviteFormProvider>
    </AcceptInviteDataProvider>
  );
});
