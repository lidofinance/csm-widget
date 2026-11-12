import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Dashboard } from './dashboard';

export const DashboardPage: FC = () => (
  <Layout wide pageName="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
    <Dashboard />
  </Layout>
);
