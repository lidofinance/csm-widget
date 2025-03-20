import { FC } from 'react';

import { Layout } from 'shared/layout';
import { MaintenanceBanner } from './maintenance-banner';
import { WelcomeSection } from './welcome-section';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TryCSM } from './try-csm';

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
