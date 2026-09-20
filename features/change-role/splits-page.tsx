import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { SplitsForm } from './splits-form';

export const SplitsPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      title="Settings"
      subtitle="Manage your operator"
      pageName="SettingsSplits"
    >
      <SettingsPageSwitcher />
      <SplitsForm key={key} />
      <Faq items={useFaq('ROLES')} />
    </Layout>
  );
};
