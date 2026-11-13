import { FC } from 'react';
import { Layout } from 'shared/layout';
import { MyOperators } from './my-operators';

export const MyOperatorsPage: FC = () => (
  <Layout
    wide
    pageName="My operators"
    breadcrumbs={[{ label: 'My Operators' }]}
  >
    <MyOperators />
  </Layout>
);
