import { Text } from '@lidofinance/lido-ui';
import { isModuleCM } from 'consts';
import { FC } from 'react';

import { Banner, WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';

export const UnsupportedPage: FC = () => {
  return (
    <Layout dummy={isModuleCM ? true : 'semi'}>
      <Banner
        title={`${isModuleCM ? 'CM' : 'CSM'} is currently being upgraded`}
        variant="secondary"
      >
        <Text size="sm">
          {isModuleCM
            ? 'A new version of the widget will be available soon'
            : 'CSM v2 is on the way — packed with new benefits! A new version of the widget will be available soon.'}
        </Text>
      </Banner>
      <WelcomeSection></WelcomeSection>
    </Layout>
  );
};
