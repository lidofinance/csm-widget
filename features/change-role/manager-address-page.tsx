import { PATH } from 'consts/urls';
import { ROLES } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { ChangeRoleForm } from './change-role-form';

export const ManagerAddressPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      pageName="SettingsManagerAddress"
      breadcrumbs={[
        { label: 'Settings', href: PATH.SETTINGS },
        { label: 'Manager Address' },
      ]}
    >
      <ChangeRoleForm key={key} role={ROLES.MANAGER} />
    </Layout>
  );
};
