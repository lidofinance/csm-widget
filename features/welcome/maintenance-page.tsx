import { FC } from 'react';

import { Layout } from 'shared/layout';
import { MaintenanceBanner } from './maintenance-banner';
import { TryCSM } from './try-csm';
import { WelcomeSection } from 'shared/components';

export const MaintenancePage: FC = () => {
  return (
    <Layout dummy={true} pageName="Maintenance">
      <MaintenanceBanner />
      <WelcomeSection />
      <TryCSM />
    </Layout>
  );
};
