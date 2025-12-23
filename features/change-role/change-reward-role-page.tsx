import { FC } from 'react';

import { FAQ_ROLES } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { RolesPageSwitcher } from 'shared/navigate';
import { ChangeRewardRole } from './change-reward-role';

export const ChangeRewardRolePage: FC = () => (
  <Layout
    title="Change Rewards Address"
    subtitle="Propose new address for change"
    pageName="ChangeRewardsRole"
  >
    <RolesPageSwitcher />
    <ChangeRewardRole />
    <Faq items={FAQ_ROLES} />
  </Layout>
);
