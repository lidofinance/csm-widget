import { FC } from 'react';

import { Layout } from 'shared/components';
import { RolesPageSwitcher } from 'shared/navigate';
import { ViewRewardRole } from './view-reward-role';

export const ViewRewardRolePage: FC = () => (
  <Layout title="Rewards address" subtitle="View current address">
    <RolesPageSwitcher />
    <ViewRewardRole />
  </Layout>
);
