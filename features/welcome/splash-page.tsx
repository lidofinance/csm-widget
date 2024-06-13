import { FC } from 'react';

import { Layout } from 'shared/components';
import { WelcomeSection } from './welcome-section';
import { LoaderBanner } from './loader-banner';

export const SplashPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <LoaderBanner />
      </WelcomeSection>
    </Layout>
  );
};
