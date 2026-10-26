import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Dashboard } from './dashboard';
import { DashboardSubtitle } from './dashboard-subtitle';

export const DashboardPage: FC = () => (
  <Layout
    title="Dashboard"
    subtitle={<DashboardSubtitle />}
    pageName="Dashboard"
  >
    <Dashboard />
  </Layout>
);
