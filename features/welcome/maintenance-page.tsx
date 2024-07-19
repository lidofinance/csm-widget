import { FC } from 'react';

import { Layout } from 'shared/components';
import { MaintenanceBanenr } from './maintenance-banner';
import { WelcomeSection } from './welcome-section';

export const MaintenancePage: FC = () => {
  return (
    <Layout dummy={true}>
      <MaintenanceBanenr />
      <WelcomeSection />
    </Layout>
  );
};
