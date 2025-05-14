import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { Banner, WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';

export const UnsupportedPage: FC = () => {
  return (
    <Layout>
      <Banner
        title="CSM is currently undergoing an upgrade"
        variant="secondary"
      >
        <Text size="sm">
          CSM v2 is on the way, packed with new benefits! A new version of the
          widget will be available shortly to enhance your experience
        </Text>
      </Banner>
      <WelcomeSection></WelcomeSection>
    </Layout>
  );
};
