import { FC } from 'react';

import { useFaq } from 'faq';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IcsPageSwitcher } from 'shared/navigate';
import { IcsApply } from './ics-apply';

export const IcsApplyPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="TypeIcsApply"
    mainPrefix={<TypeBackButton />}
  >
    <IcsPageSwitcher />
    <IcsApply />
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
