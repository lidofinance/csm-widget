import { FC } from 'react';

import { Layout } from 'shared/layout';
import { Welcome } from './welcome';
import { TryOtherNetwork } from './try-other-network';
import { NavigateCMv1 } from './navigate-cm-v1';

export const WelcomePage: FC = () => {
  return (
    <Layout pageName="Welcome">
      <Welcome />
      <TryOtherNetwork />
      <NavigateCMv1 />
    </Layout>
  );
};
