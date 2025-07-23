import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FAQ_ROLES } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { RolesPageSwitcher } from 'shared/navigate';
import { AcceptInvite } from './accept-invite';

export const AcceptInvitePage: FC = () => {
  return (
    <Layout
      title="Inbox requests"
      subtitle="Accept incoming requests for addresses changes"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageInboxRequests}
    >
      <RolesPageSwitcher />
      <AcceptInvite />
      <Faq items={FAQ_ROLES} />
    </Layout>
  );
};
