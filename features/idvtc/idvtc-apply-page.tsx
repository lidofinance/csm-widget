import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IdvtcPageSwitcher } from 'shared/navigate';
import { IdvtcApply } from './idvtc-apply';

export const IdvtcApplyPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeDvtApply"
    mainPrefix={<TypeBackButton />}
  >
    <IdvtcPageSwitcher />
    <IdvtcApply />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
