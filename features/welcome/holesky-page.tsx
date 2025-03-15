import { FC } from 'react';

import { Layout } from 'shared/layout';
import { HoleskyBanner } from './holesky-banner';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TryCSM } from './try-csm';

export const HoleskyPage: FC = () => {
  return (
    <Layout
      dummy={true}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageMaintenance}
    >
      <HoleskyBanner />
      <TryCSM />
    </Layout>
  );
};
