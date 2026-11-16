import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { ClaimerForm } from './claimer-form';

export const ClaimerPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      pageName="SettingsClaimer"
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Rewards claimer' },
      ]}
    >
      <ClaimerForm key={key} />
    </Layout>
  );
};
