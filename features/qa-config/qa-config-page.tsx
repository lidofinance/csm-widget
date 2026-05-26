import { FC } from 'react';

import { Layout } from 'shared/layout';
import { QaConfigForm } from './qa-config-form';

export const QaConfigPage: FC = () => (
  <Layout
    dummy={true}
    title="QA Config"
    subtitle="Override RPC and Consensus Layer endpoints"
    pageName="QA Config"
  >
    <QaConfigForm />
  </Layout>
);
