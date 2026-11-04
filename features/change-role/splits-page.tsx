import { PATH } from 'consts/urls';
import { FC } from 'react';
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
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Splits' },
      ]}
    >
      <SettingsPageSwitcher />
      <SplitsForm key={key} />
    </Layout>
  );
};
