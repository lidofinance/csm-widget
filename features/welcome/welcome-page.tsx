import { FC } from 'react';

import { useModule } from 'modules/web3';
import { Layout } from 'shared/layout';
import { Welcome } from './welcome';
import { TryOtherNetwork } from './try-other-network';
import { NavigateCMv1 } from './navigate-cm-v1';

export const WelcomePage: FC = () => {
  const { isCM } = useModule();

  return (
    <Layout pageName="Welcome">
      <Welcome />
      <TryOtherNetwork />
      {isCM && <NavigateCMv1 />}
    </Layout>
  );
};
