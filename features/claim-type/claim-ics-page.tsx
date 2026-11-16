import { FC } from 'react';

import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { ClaimIcs } from './claim-ics';

export const ClaimIcsPage: FC = () => (
  <Layout
    pageName="ClaimIcs"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified Community Staker', href: PATH.TYPE_ICS_SYSTEM },
      { label: 'Claim' },
    ]}
  >
    <ClaimIcs />
  </Layout>
);
