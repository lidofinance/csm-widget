import { FC } from 'react';

import { Layout } from 'shared/layout';
import { RolesPageSwitcher } from 'shared/navigate';
import { AcceptInvite } from './accept-invite';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const AcceptInvitePage: FC = () => {
  return (
    <Layout
      title="Inbox requests"
      subtitle="Accept incoming requests for addresses changes"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageInboxRequests}
    >
      <RolesPageSwitcher />
      <AcceptInvite />
    </Layout>
  );
};
