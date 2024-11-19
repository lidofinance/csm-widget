import { FC } from 'react';

import { Layout } from 'shared/layout';
import { StarterPack } from './starter-pack';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const StarterPackPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageStarterPack}
    >
      <StarterPack />
    </Layout>
  );
};
