import { FC } from 'react';

import { Layout } from 'shared/layout';
import { Welcome } from './welcome';
import { TryOtherNetwork } from './try-other-network';
import { NavigateCMv1 } from './navigate-cm-v1';

// TODO: section: Try Lido CSM (only for CM)
export const WelcomePage: FC = () => {
  return (
    <Layout pageName="Welcome">
      <Welcome />r
      <TryOtherNetwork />
      <NavigateCMv1 />
    </Layout>
  );
};
