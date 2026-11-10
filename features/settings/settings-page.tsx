import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SettingsHub } from './settings-hub';

export const SettingsPage: FC = () => {
  const key = useWeb3Key();
  const faq = useFaq('ROLES');

  return (
    <Layout pageName="SettingsRoles" breadcrumbs={[{ label: 'Settings' }]}>
      <SettingsHub key={key} />
      <Faq items={faq} />
    </Layout>
  );
};
