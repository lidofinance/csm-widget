import { FC } from 'react';

import { Layout } from 'shared/components';
import { MaintenanceBanenr } from './maintenance-banner';
import { WelcomeSection } from './welcome-section';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const MaintenancePage: FC = () => {
  return (
    <Layout
      dummy={true}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageMaintenance}
    >
      <MaintenanceBanenr />
      <WelcomeSection />
    </Layout>
  );
};
