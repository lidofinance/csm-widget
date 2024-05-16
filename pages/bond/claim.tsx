import { ClaimBondPage } from 'features/claim-bond';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Page = () => (
  <OnlyNodeOperator>
    <ClaimBondPage />
  </OnlyNodeOperator>
);

export default Page;
