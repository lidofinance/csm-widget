import { FC } from 'react';

import { FAQ_ROLES } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { AcceptInvite } from './accept-invite';

export const AcceptInvitePage: FC = () => {
  return (
    <Layout
      title="Inbox requests"
      subtitle="Accept incoming requests for addresses changes"
      pageName="InboxRequests"
    >
      <SettingsPageSwitcher />
      <AcceptInvite />
      <Faq items={FAQ_ROLES} />
    </Layout>
  );
};
