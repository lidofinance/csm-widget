import { FC } from 'react';

import { useFaq } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { IcsApply } from './ics-apply';

export const IcsApplyPage: FC = () => {
  const { FAQ_OPERATOR_TYPE } = useFaq();

  return (
    <Layout
      title="Apply for Identified Community Stakers List"
      subtitle="Get verified as an Identified Community Staker"
      pageName="TypeIcs"
    >
      <TypePageSwitcher />
      <IcsApply />
      <Faq items={FAQ_OPERATOR_TYPE} />
    </Layout>
  );
};
