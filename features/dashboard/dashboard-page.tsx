import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Dashboard } from './dashboard';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const DashboardPage: FC = () => {
  return (
    <Layout
      title="Community Staking Module 1"
      subtitle="Dashboard"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageDashboard}
    >
      <Dashboard />
    </Layout>
  );
};
