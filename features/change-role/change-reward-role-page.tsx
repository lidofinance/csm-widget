import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FAQ_ROLES } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { RolesPageSwitcher } from 'shared/navigate';
import { ChangeRewardRole } from './change-reward-role';

export const ChangeRewardRolePage: FC = () => (
  <Layout
    title="Change Rewards Address"
    subtitle="Propose new address for change"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageChangeRewardsRole}
  >
    <RolesPageSwitcher />
    <ChangeRewardRole />
    <Faq items={FAQ_ROLES} />
  </Layout>
);
