import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
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
    >
      <SettingsPageSwitcher />
      <ClaimerForm key={key} />
      <Faq items={useFaq('ROLES')} />
    </Layout>
  );
};
