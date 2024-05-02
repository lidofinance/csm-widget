import { ClaimBondPage } from 'features/claim-bond';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const BondPage = () => (
  <OnlyNodeOperator>
    <ClaimBondPage />
  </OnlyNodeOperator>
);

export default BondPage;
