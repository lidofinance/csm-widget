import { OnlyNodeOperator } from 'features/loader/only-node-operator';
import { RemoveKeysPage } from 'features/remove-keys';

const Page = () => (
  <OnlyNodeOperator>
    <RemoveKeysPage />
  </OnlyNodeOperator>
);

export default Page;
