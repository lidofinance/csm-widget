import { FC } from 'react';
import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { ClaimIdvtc } from './claim-idvtc';

// Wide for the ICS two-card state; the other states centre a 600px column
export const ClaimIdvtcPage: FC = () => (
  <Layout
    wide
    pageName="ClaimIdvtc"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified DVT Cluster', href: PATH.TYPE_IDVTC_DESCRIPTION },
      { label: 'Claim' },
    ]}
  >
    <ClaimIdvtc />
  </Layout>
);
