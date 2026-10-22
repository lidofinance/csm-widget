import { FC } from 'react';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { TopUpAllocationForm } from './top-up-allocation-form';

export const GeneralPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      title="Settings"
      subtitle="Manage your operator"
      pageName="SettingsGeneral"
    >
      <SettingsPageSwitcher />
      <NoSSRWrapper key={key}>
        <TopUpAllocationForm />
      </NoSSRWrapper>
    </Layout>
  );
};
