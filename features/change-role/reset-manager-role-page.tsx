import { FC } from 'react';

import { Layout } from 'shared/components';
import { RolesPageSwitcher } from 'shared/navigate';
import { ResetManagerRole } from './reset-manager-role';

export const ResetManagerRolePage: FC = () => (
  <Layout
    title="Change Manager address"
    subtitle="Propose new address for change"
  >
    <RolesPageSwitcher />
    <ResetManagerRole />
  </Layout>
);
