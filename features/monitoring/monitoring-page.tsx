import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Monitoring } from './monitoring';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const MonitoringPage: FC = () => {
  const { FAQ_MONITORING } = useFaq();

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
