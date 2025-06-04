import { FC } from 'react';

import { Layout } from 'shared/layout';
import { MaintenanceBanner } from './maintenance-banner';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TryCSM } from './try-csm';
import { WelcomeSection } from 'shared/components';

export const MaintenancePage: FC = () => {
  return (
    <Layout
      dummy={true}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageMaintenance}
    >
      <MaintenanceBanner />
      <WelcomeSection />
      <TryCSM />
    </Layout>
  );
};
