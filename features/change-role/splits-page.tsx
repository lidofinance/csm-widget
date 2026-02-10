import { FAQ_ROLES } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { RolesPageSwitcher } from 'shared/navigate';
import { SplitsForm } from './splits-form';

export const SplitsPage: FC = () => {
  const key = useWeb3Key();

  return (
    <Layout
      title="Roles"
      subtitle="Manage your operator addresses"
      pageName="Roles"
    >
      <RolesPageSwitcher />
      <NoSSRWrapper key={key}>
        <SplitsForm />
      </NoSSRWrapper>
      <Faq items={FAQ_ROLES} />
    </Layout>
  );
};
