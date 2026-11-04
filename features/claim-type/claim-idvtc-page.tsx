import { FC } from 'react';
import { TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IdvtcPageSwitcher, Gate, TypePageSwitcher } from 'shared/navigate';
import { ClaimIdvtc } from './claim-idvtc';

// Wide for the ICS two-card state; the other states centre a 600px column
export const ClaimIdvtcPage: FC = () => (
  <Layout
    wide
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="ClaimIdvtc"
    mainPrefix={<TypeBackButton />}
  >
    <Gate rule="ICS_APPLY_ENABLED" fallback={<TypePageSwitcher />}>
      <IdvtcPageSwitcher />
    </Gate>
    <ClaimIdvtc />
  </Layout>
);
