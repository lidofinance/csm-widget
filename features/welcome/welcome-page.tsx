import { FC } from 'react';

import { Layout } from 'shared/components';
import { Banner } from './banner';

export const WelcomePage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      subtitle="Your way to solo staking"
    >
      <Banner />
    </Layout>
  );
};
