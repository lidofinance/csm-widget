import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { WelcomeSection } from 'shared/components';
import { Block } from 'shared/components';
import { Layout } from 'shared/layout';

export const UnsupportedPage: FC = () => {
  return (
    <Layout>
      <WelcomeSection>
        <Block accent="error">
          <Text color="error" size="sm">
            This widget is not yet compatible with the current smart contract
            version. We are working on an update and it will be available soon.
          </Text>
        </Block>
      </WelcomeSection>
    </Layout>
  );
};
