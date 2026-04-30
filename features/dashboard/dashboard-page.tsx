import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Dashboard } from './dashboard';
import { DashboardSubtitle } from './dashboard-subtitle';
import { DashboardTitle } from './dashboard-title';

export const DashboardPage: FC = () => (
  <Layout
    title={<DashboardTitle />}
    subtitle={<DashboardSubtitle />}
    pageName="Dashboard"
  >
    <Dashboard />
  </Layout>
);
