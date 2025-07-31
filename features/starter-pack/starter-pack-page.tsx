import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { InvitesRedirect } from './invites-redirect';
import { StarterPack } from './starter-pack';
import { Faq } from 'shared/components';
import { FAQ_MAIN } from 'faq';

export const StarterPackPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageStarterPack}
    >
      <InvitesRedirect />
      <StarterPack />
      <Faq items={FAQ_MAIN} />
    </Layout>
  );
};
