import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { UnlockBond } from './unlock-bond';
import { Faq } from 'shared/components';
import { FAQ_LOCKED } from 'faq';

export const UnlockBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Cover locked bond"
    pageName="UnlockBond"
  >
    <BondPageSwitcher />
    <UnlockBond />
    <Faq items={FAQ_LOCKED} />
  </Layout>
);
