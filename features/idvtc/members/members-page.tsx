import { FC } from 'react';
import { IdvtcSiwePage } from '../idvtc-siwe-page';
import { MembersContent } from './members-content';
import { MembersSignInPage } from './members-signin-page';

export const MembersPage: FC = () => (
  <IdvtcSiwePage
    title="Cluster members"
    pageName="ClusterMembers"
    fallback={<MembersSignInPage />}
  >
    <MembersContent />
  </IdvtcSiwePage>
);
