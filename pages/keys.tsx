import { AddKeysPage } from 'features/add-keys';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const KeysPage = () => (
  <OnlyNodeOperator>
    <AddKeysPage />
  </OnlyNodeOperator>
);

export default KeysPage;
