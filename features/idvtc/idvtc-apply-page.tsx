import { FC } from 'react';

import { useFaq } from 'faq';
import { PATH } from 'consts/urls';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { IdvtcApply } from './idvtc-apply';

export const IdvtcApplyPage: FC = () => (
  <Layout
    pageName="TypeDvtApply"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified DVT Cluster', href: PATH.TYPE_IDVTC_DESCRIPTION },
      { label: 'Application' },
    ]}
  >
    <IdvtcApply />
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
