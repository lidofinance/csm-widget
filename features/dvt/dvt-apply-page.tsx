import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { BackButton, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { DvtPageSwitcher } from 'shared/navigate';
import { DvtApply } from './dvt-apply';
import { PATH } from 'consts/urls';

export const DvtApplyPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeDvt"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <DvtPageSwitcher />
    <DvtApply />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
