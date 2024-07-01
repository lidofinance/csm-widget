import { FC } from 'react';

import { Layout } from 'shared/components';
import { RolesPageSwitcher } from 'shared/navigate';
import { ChangeRewardRole } from './change-reward-role';

export const ChangeRewardRolePage: FC = () => (
  <Layout
    title="Change Rewards address"
    subtitle="Propose new address for change"
  >
    <RolesPageSwitcher />
    <ChangeRewardRole />
  </Layout>
);
