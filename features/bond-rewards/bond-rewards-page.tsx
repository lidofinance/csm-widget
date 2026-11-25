import { useFaq } from 'faq';
import { FC } from 'react';

import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { BondRewards } from './bond-rewards';

export const BondRewardsPage: FC = () => {
  const faq = useFaq('BOND');

  return (
    <Layout
      wide
      pageName="BondRewards"
      breadcrumbs={[{ label: 'Bond & Rewards' }]}
    >
      <BondRewards />
      <Faq items={faq} />
    </Layout>
  );
};
