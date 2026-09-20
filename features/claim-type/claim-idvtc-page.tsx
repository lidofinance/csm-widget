import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IdvtcPageSwitcher, Gate, TypePageSwitcher } from 'shared/navigate';
import { ClaimIdvtc } from './claim-idvtc';

export const ClaimIdvtcPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="ClaimIdvtc"
    mainPrefix={<TypeBackButton />}
  >
    <Gate rule="ICS_APPLY_ENABLED" fallback={<TypePageSwitcher />}>
      <IdvtcPageSwitcher />
    </Gate>
    <ClaimIdvtc />
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
