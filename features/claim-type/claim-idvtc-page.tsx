import { FAQ_OPERATOR_TYPE } from 'faq';
import { FC } from 'react';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { DvtPageSwitcher, Gate, TypePageSwitcher } from 'shared/navigate';
import { ClaimIdvtc } from './claim-idvtc';

export const ClaimIdvtcPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="ClaimIdvtc"
    mainPrefix={<TypeBackButton />}
  >
    <Gate rule="ICS_APPLY_ENABLED" fallback={<TypePageSwitcher />}>
      <DvtPageSwitcher />
    </Gate>
    <ClaimIdvtc />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
