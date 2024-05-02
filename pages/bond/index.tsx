import { AddBondPage } from 'features/add-bond';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const BondPage = () => (
  <OnlyNodeOperator>
    <AddBondPage />
  </OnlyNodeOperator>
);

export default BondPage;
