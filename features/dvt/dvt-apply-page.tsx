import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { DvtPageSwitcher } from 'shared/navigate';
import { DvtApply } from './dvt-apply';

export const DvtApplyPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeDvt"
    mainPrefix={<TypeBackButton />}
  >
    <DvtPageSwitcher />
    <DvtApply />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
