import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Wrapped } from './wrapped';

export const WrappedPage: FC = () => {
  return (
    <Layout pageName="Wrapped">
      <Wrapped />
    </Layout>
  );
};
