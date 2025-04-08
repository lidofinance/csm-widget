import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Monitoring } from './monitoring';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const MonitoringPage: FC = () => {
  return (
    <Layout
      title="Monitoring"
      subtitle="Check performance of your keys"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageMonitoring}
    >
      <Monitoring />
    </Layout>
  );
};
