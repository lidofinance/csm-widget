import { FC } from 'react';

import { Layout } from 'shared/components';
import { RolesPageSwitcher } from 'shared/navigate';
import { ChangeManagerRole } from './change-manager-role';

export const ChangeManagerRolePage: FC = () => (
  <Layout
    title="Change Manager address"
    subtitle="Propose new address for change"
  >
    <RolesPageSwitcher />
    <ChangeManagerRole />
  </Layout>
);
