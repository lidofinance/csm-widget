import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Dashboard } from './dashboard';

export const DashboardPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module"
      subtitle="Dashboard"
      pageName="Dashboard"
    >
      <Dashboard />
    </Layout>
  );
};
