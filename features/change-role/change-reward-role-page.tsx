import { FC } from 'react';

import { Layout } from 'shared/components';
import { RolesPageSwitcher } from 'shared/navigate';
import { ChangeRewardRole } from './change-reward-role';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const ChangeRewardRolePage: FC = () => (
  <Layout
    title="Change Rewards Address"
    subtitle="Propose new address for change"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageChangeRewardsRole}
  >
    <RolesPageSwitcher />
    <ChangeRewardRole />
  </Layout>
);
