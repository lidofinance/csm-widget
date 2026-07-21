import { FC } from 'react';
import { SiweAuthGate } from 'modules/siwe';
import { NoSSRWrapper } from 'shared/components';
import { Layout } from 'shared/layout';
import { IdvtcClusterSwitcher } from 'shared/navigate';
import { MembersContent } from './members-content';
import { MembersSignInPage } from './members-signin-page';

export const MembersPage: FC = () => (
  <Layout title="Cluster members" pageName="ClusterMembers">
    <IdvtcClusterSwitcher />
    <NoSSRWrapper>
      <SiweAuthGate fallback={<MembersSignInPage />}>
        <MembersContent />
      </SiweAuthGate>
    </NoSSRWrapper>
  </Layout>
);
