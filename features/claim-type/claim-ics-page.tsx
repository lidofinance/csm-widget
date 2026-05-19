import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { BackButton, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { ClaimIcs } from './claim-ics';

export const ClaimIcsPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="ClaimIcs"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <TypePageSwitcher />
    <ClaimIcs />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
