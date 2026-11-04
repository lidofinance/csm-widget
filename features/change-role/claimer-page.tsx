import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { ClaimerForm } from './claimer-form';

export const ClaimerPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      title="Settings"
      subtitle="Manage your operator"
      pageName="SettingsClaimer"
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Claimer' },
      ]}
    >
      <SettingsPageSwitcher />
      <ClaimerForm key={key} />
    </Layout>
  );
};
