import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { ClaimType } from './claim-type';
import { TypePageSwitcher } from 'shared/navigate';

export const ClaimTypePage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="ClaimType"
  >
    <TypePageSwitcher />
    <ClaimType />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
