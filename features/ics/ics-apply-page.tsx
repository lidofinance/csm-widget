import { FC } from 'react';

import { useFaq } from 'faq';
import { PATH } from 'consts/urls';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { IcsApply } from './ics-apply';

export const IcsApplyPage: FC = () => (
  <Layout
    pageName="TypeIcsApply"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified Community Staker', href: PATH.TYPE_ICS_SYSTEM },
      { label: 'Application' },
    ]}
  >
    <IcsApply />
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
