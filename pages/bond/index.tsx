import { AddBondPage } from 'features/add-bond';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Page = () => (
  <OnlyNodeOperator>
    <AddBondPage />
  </OnlyNodeOperator>
);

export default Page;
