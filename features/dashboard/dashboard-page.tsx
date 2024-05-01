import { FC } from 'react';
import { Layout } from 'shared/components';
import { Dashboard } from './dashboard';

export const DashboardPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Dashboard">
      <Dashboard />
    </Layout>
  );
};
