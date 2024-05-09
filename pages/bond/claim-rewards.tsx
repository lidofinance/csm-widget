import { ClaimRewardsPage } from 'features/claim-rewards';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const BondPage = () => (
  <OnlyNodeOperator>
    <ClaimRewardsPage />
  </OnlyNodeOperator>
);

export default BondPage;
