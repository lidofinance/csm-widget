import { FC } from 'react';

import { Loader } from '@lidofinance/lido-ui';
import { Stack, WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';

export const SplashPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <Stack align="center" justify="center">
          <Loader size="large" />
        </Stack>
      </WelcomeSection>
    </Layout>
  );
};
