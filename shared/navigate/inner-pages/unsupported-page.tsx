import { Text } from '@lidofinance/lido-ui';
import { config } from 'config';
import { MODULE_SHORT_NAME } from 'consts';
import { FC } from 'react';
import { Banner, WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';

export const UnsupportedPage: FC = () => (
  <Layout dummy="semi">
    <Banner
      title={`${MODULE_SHORT_NAME[config.module]} is currently being upgraded`}
      variant="secondary"
    >
      <Text size="sm">A new version of the widget will be available soon.</Text>
    </Banner>
    <WelcomeSection />
  </Layout>
);
