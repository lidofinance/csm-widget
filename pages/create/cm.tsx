import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { CreatePageGate } from 'shared/navigate';

const Page = () => (
  <CreatePageGate rule="CAN_CREATE_CM">
    <CreateNodeOperatorPage />
  </CreatePageGate>
);

export default Page;
