import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Monitoring } from './monitoring';
import { Faq } from 'shared/components';
import { FAQ_MONITORING } from 'faq';

export const MonitoringPage: FC = () => {
  return (
    <Layout
      title="Monitoring"
      subtitle="Check performance of your keys"
      pageName="Monitoring"
    >
      <Monitoring />
      <Faq items={FAQ_MONITORING} />
    </Layout>
  );
};
