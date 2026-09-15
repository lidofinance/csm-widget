import { FC } from 'react';
import { Layout } from 'shared/layout';
import { MyOperators } from './my-operators';

export const MyOperatorsPage: FC = () => (
  <Layout
    title="My operators"
    subtitle="See and manage all the CSM operators associated with your wallet"
    pageName="My operators"
  >
    <MyOperators />
  </Layout>
);
