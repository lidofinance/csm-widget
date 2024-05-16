import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { DashboardPage } from 'features/dashboard';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';

const Page = () => (
  <OnlyNodeOperator fallback={<CreateNodeOperatorPage />}>
    <DashboardPage />
  </OnlyNodeOperator>
);

export default Page;
