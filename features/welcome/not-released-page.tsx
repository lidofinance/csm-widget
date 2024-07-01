import { FC } from 'react';

import { Layout } from 'shared/components';
import { NotReleasedBanner } from './not-released-banner';
import { WelcomeSection } from './welcome-section';

export const NotReleasedPage: FC = () => {
  return (
    <Layout dummy={true}>
      <NotReleasedBanner />
      <WelcomeSection />
    </Layout>
  );
};
