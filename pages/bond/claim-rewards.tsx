import { ClaimRewardsPage } from 'features/claim-rewards';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Page = () => (
  <OnlyNodeOperator>
    <ClaimRewardsPage />
  </OnlyNodeOperator>
);

export default Page;
