import { AddKeysPage } from 'features/add-keys';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Page = () => (
  <OnlyNodeOperator>
    <AddKeysPage />
  </OnlyNodeOperator>
);

export default Page;
