import { FC } from 'react';

import { Layout } from 'shared/layout';
import { RolesPageSwitcher } from 'shared/navigate';
import { ChangeManagerRole } from './change-manager-role';
import { Faq } from 'shared/components';
import { FAQ_ROLES } from 'faq';

export const ChangeManagerRolePage: FC = () => (
  <Layout
    title="Change Manager Address"
    subtitle="Propose new address for change"
    pageName="ChangeManagerRole"
  >
    <RolesPageSwitcher />
    <ChangeManagerRole />
    <Faq items={FAQ_ROLES} />
  </Layout>
);
