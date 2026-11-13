import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsHub } from './settings-hub';

export const SettingsPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout pageName="SettingsRoles" breadcrumbs={[{ label: 'Settings' }]}>
      <SettingsHub key={key} />
    </Layout>
  );
};
