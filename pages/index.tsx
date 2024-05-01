import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { DashboardPage } from 'features/dashboard';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Switch = () => (
  <OnlyNodeOperator fallback={<CreateNodeOperatorPage />}>
    <DashboardPage />
  </OnlyNodeOperator>
);

export default Switch;
