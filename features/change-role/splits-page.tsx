import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SplitsForm } from './splits-form';

export const SplitsPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      pageName="SettingsSplits"
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Rewards splitters' },
      ]}
    >
      <SplitsForm key={key} />
    </Layout>
  );
};
