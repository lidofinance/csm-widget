import { ChangeManagerRolePage } from 'features/change-role';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Page = () => (
  <OnlyNodeOperator>
    <ChangeManagerRolePage />
  </OnlyNodeOperator>
);

export default Page;
