import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { Layout } from 'shared/components';
import { WelcomeSection } from 'features/welcome/welcome-section';
import { LoaderWrapperStyle } from './styles';

export const SplashPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <LoaderWrapperStyle>
          <Loader size="large" />
        </LoaderWrapperStyle>
      </WelcomeSection>
    </Layout>
  );
};
