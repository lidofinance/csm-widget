import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { UnlockBond } from './unlock-bond';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const UnlockBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Cover locked bond"
    pageName="UnlockBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Cover locked bond' },
    ]}
  >
    <BondPageSwitcher />
    <UnlockBond />
    <Faq items={useFaq('LOCKED')} />
  </Layout>
);
