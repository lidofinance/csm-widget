import { PATH } from 'consts/urls';
import { RewardsHistoryPage } from 'features/rewards-history';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.BOND_REWARDS_HISTORY}>
    <RewardsHistoryPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
