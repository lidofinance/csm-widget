import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack, WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';

export const SplashPage: FC = () => (
  <Layout dummy="semi">
    <WelcomeSection>
      <Stack align="center" justify="center">
        <Loader size="large" />
      </Stack>
    </WelcomeSection>
  </Layout>
);
