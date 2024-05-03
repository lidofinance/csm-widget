import { FC } from 'react';

import { Layout } from 'shared/components';
import { Banner } from './banner';
import { useAccount } from 'shared/hooks';
import { Fallback } from 'shared/hat/fallback/fallback';

export const WelcomePage: FC = () => {
  const { active, isConnected } = useAccount();
  return (
    <Layout
      title="Community Staking Module"
      subtitle="Your way to solo staking"
    >
      {!active && isConnected ? <Fallback /> : undefined}
      <Banner />
    </Layout>
  );
};
