import { FC } from 'react';

import { Layout } from 'shared/layout';
import { Welcome } from './welcome';
import { TryCSM } from './try-csm';

export const WelcomePage: FC = () => {
  return (
    <Layout pageName="Welcome">
      <Welcome />
      <TryCSM />
    </Layout>
  );
};
