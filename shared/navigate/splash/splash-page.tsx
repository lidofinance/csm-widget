import { FC } from 'react';

import { Layout } from 'shared/layout';
import { LoaderBanner } from './loader-banner';
import { WelcomeSection } from './welcome-section';

export const SplashPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <LoaderBanner />
      </WelcomeSection>
    </Layout>
  );
};
