import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { InvitesRedirect } from './invites-redirect';
import { StarterPack } from './starter-pack';

export const StarterPackPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageStarterPack}
    >
      <InvitesRedirect />
      <StarterPack />
    </Layout>
  );
};
