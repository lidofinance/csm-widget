import { FC } from 'react';

import { Layout } from 'shared/layout';
import { Welcome } from './welcome';
import { TryOtherNetwork } from './try-other-network';
import { NavigateCMv1 } from './navigate-cm-v1';
import { isModuleCM } from 'consts';

export const WelcomePage: FC = () => {
  return (
    <Layout pageName="Welcome">
      <Welcome />
      <TryOtherNetwork />
      {isModuleCM && <NavigateCMv1 />}
    </Layout>
  );
};
