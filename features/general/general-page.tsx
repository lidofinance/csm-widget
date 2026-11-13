import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { TopUpAllocationForm } from './top-up-allocation-form';

export const GeneralPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      pageName="SettingsGeneral"
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Top-ups' },
      ]}
    >
      <TopUpAllocationForm key={key} />
    </Layout>
  );
};
