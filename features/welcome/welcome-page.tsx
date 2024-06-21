import { FC } from 'react';

import { Layout } from 'shared/components';
import { Welcome } from './welcome';

export const WelcomePage: FC = () => {
  return (
    <Layout>
      <Welcome />
    </Layout>
  );
};
