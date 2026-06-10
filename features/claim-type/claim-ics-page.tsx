import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { Gate, IcsPageSwitcher, TypePageSwitcher } from 'shared/navigate';
import { ClaimIcs } from './claim-ics';

export const ClaimIcsPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="ClaimIcs"
    mainPrefix={<TypeBackButton />}
  >
    <Gate rule="ICS_APPLY_ENABLED" fallback={<TypePageSwitcher />}>
      <IcsPageSwitcher />
    </Gate>
    <ClaimIcs />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
