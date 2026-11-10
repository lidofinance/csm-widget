import { FC } from 'react';
import { PATH } from 'consts/urls';
import { IdvtcSiwePage } from '../idvtc-siwe-page';
import { ClusterMembersSection } from './members-content';
import { MembersSignInPage } from './members-signin-page';

export const MembersPage: FC = () => (
  <IdvtcSiwePage
    breadcrumbs={[
      { label: 'Settings', href: PATH.SETTINGS },
      { label: 'Cluster members' },
    ]}
    pageName="ClusterMembers"
    fallback={<MembersSignInPage />}
  >
    <ClusterMembersSection />
  </IdvtcSiwePage>
);
