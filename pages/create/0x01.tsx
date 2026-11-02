import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CreateOperatorPage } from 'features/create-node-operator';
import { CreatePageGate } from 'shared/navigate';

const Page = () => (
  <CreatePageGate rule="CAN_CREATE_0X01">
    <CreateOperatorPage type={OPERATOR_TYPE.CSM_DEF} />
  </CreatePageGate>
);

export default Page;
