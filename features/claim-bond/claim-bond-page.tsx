import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { ClaimBond } from './claim-bond';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const ClaimBondPage: FC = () => {
  const { FAQ_BOND } = useFaq();

  return (
    <Layout
      title="Manage Bond & Rewards"
      subtitle="Select a claiming option for bond and rewards"
      pageName="ClaimBond"
    >
      <BondPageSwitcher />
      <ClaimBond />
      <Faq items={FAQ_BOND} />
    </Layout>
  );
};
