import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { UnlockBond } from './unlock-bond';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const UnlockBondPage: FC = () => {
  const { FAQ_LOCKED } = useFaq();

  return (
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
};
