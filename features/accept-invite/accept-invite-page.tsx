import { PATH } from 'consts/urls';
import { FC } from 'react';

import { useShowRule } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { AcceptInvite } from './accept-invite';

export const AcceptInvitePage: FC = () => {
  const check = useShowRule();
  const hasSettings = check('HAS_MANAGER_ROLE') || check('HAS_REWARDS_ROLE');

  return (
    <Layout
      pageName="InboxRequests"
      breadcrumbs={
        hasSettings
          ? [
              { label: 'Settings', href: PATH.SETTINGS },
              { label: 'Incoming requests' },
            ]
          : [{ label: 'Incoming requests' }]
      }
    >
      <AcceptInvite />
    </Layout>
  );
};
