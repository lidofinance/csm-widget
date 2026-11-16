import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsPageSwitcher } from 'shared/navigate';
import { MetadataForm } from './metadata-form';

export const MetadataPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      title="Settings"
      subtitle="Manage your operator"
      pageName="SettingsMetadata"
    >
      <SettingsPageSwitcher />
      <MetadataForm key={key} />
    </Layout>
  );
};
