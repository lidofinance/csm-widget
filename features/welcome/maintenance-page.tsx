import { FC } from 'react';
import { WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';
import { MaintenanceBanner } from './maintenance-banner';
import { TryOtherNetwork } from './try-other-network';

export const MaintenancePage: FC = () => (
  <Layout dummy={true} pageName="Maintenance">
    <MaintenanceBanner />
    <WelcomeSection />
    <TryOtherNetwork />
  </Layout>
);
