import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { BackButton, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { IcsApply } from './ics-apply';
import { PATH } from 'consts/urls';

export const IcsApplyPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="TypeIcs"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <TypePageSwitcher />
    <IcsApply />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
