import { PATH } from 'consts/urls';
import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
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
      <NoSSRWrapper key={key}>
        <ClaimerForm />
      </NoSSRWrapper>
      <Faq items={useFaq('ROLES')} />
    </Layout>
  );
};
