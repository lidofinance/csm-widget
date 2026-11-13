import { Spinner, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';

export const SplashPage: FC = () => (
  <Layout>
    <WelcomeSection>
      <Stack align="center" justify="center">
        <Spinner size="lg" dataTestId={{ root: 'loader' }} />
      </Stack>
    </WelcomeSection>
  </Layout>
);
