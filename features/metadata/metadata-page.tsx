import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { MetadataForm } from './metadata-form';

export const MetadataPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      pageName="SettingsMetadata"
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Meta data' },
      ]}
    >
      <MetadataForm key={key} />
    </Layout>
  );
};
