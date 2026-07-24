import { FC } from 'react';

import { Layout } from 'shared/layout';
import { QaConfigForm } from './qa-config-form';
import { QaFeatureFlags } from './qa-feature-flags';

export const QaConfigPage: FC = () => (
  <Layout
    dummy={true}
    title="QA Config"
    subtitle="Override endpoints and feature flags"
    pageName="QA Config"
  >
    <QaFeatureFlags />
    <QaConfigForm />
  </Layout>
);
