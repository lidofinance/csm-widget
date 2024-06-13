import { DashboardPage } from 'features/dashboard';
import { OnlyNodeOperator } from 'features/loader/only-node-operator';
import { StarterPackPage } from 'features/starter-pack';

const Page = () => (
  <OnlyNodeOperator fallback={<StarterPackPage />}>
    <DashboardPage />
  </OnlyNodeOperator>
);

export default Page;
