import { FC } from 'react';

import { isModuleCM } from 'consts';
import { FAQ_ROLES_CM, FAQ_ROLES_CSM } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { AcceptInvite } from './accept-invite';

// Invitee has no active operator → branch on the STATIC deploy module.
export const AcceptInvitePage: FC = () => {
  return (
    <Layout
      title="Inbox requests"
      subtitle="Accept incoming requests for addresses changes"
      pageName="InboxRequests"
    >
      <SettingsPageSwitcher />
      <AcceptInvite />
      <Faq items={isModuleCM ? FAQ_ROLES_CM : FAQ_ROLES_CSM} />
    </Layout>
  );
};
