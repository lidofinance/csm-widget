import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { SplitsForm } from './splits-form';

export const SplitsPage: FC = () => {
  const key = useWeb3Key();
  const { FAQ_ROLES } = useFaq();

  return (
    <Layout
      title="Settings"
      subtitle="Manage your operator"
      pageName="Settings"
    >
      <SettingsPageSwitcher />
      <NoSSRWrapper key={key}>
        <SplitsForm />
      </NoSSRWrapper>
      <Faq items={FAQ_ROLES} />
    </Layout>
  );
};
