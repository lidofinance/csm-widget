import { ROLES } from '@lidofinance/lido-csm-sdk';
import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { ChangeRoleForm } from './change-role-form';

export const RewardAddressPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      title="Settings"
      subtitle="Manage your operator"
      pageName="SettingsRewardsAddress"
    >
      <SettingsPageSwitcher />
      <ChangeRoleForm key={key} role={ROLES.REWARDS} />
      <Faq items={useFaq('ROLES')} />
    </Layout>
  );
};
