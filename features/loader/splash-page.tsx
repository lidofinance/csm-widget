import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { Layout } from 'shared/components';
import { LoaderWrapperStyle } from './styles';

export const SplashPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      subtitle="Your way to solo staking"
    >
      <LoaderWrapperStyle>
        <Loader size="large" />
      </LoaderWrapperStyle>
    </Layout>
  );
};
