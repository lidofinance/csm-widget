import { PATH } from 'consts/urls';
import { ROLES } from '@lidofinance/lido-csm-sdk';
import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
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
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Rewards address' },
      ]}
    >
      <SettingsPageSwitcher />
      <NoSSRWrapper key={key}>
        <ChangeRoleForm role={ROLES.REWARDS} />
      </NoSSRWrapper>
      <Faq items={useFaq('ROLES')} />
    </Layout>
  );
};
