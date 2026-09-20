import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
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
      {deployedModules.includes(MODULE_NAME.CM) && <NavigateCMv1 />}
    </Layout>
  );
};
