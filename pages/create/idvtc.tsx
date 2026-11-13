import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CreateOperatorPage } from 'features/create-node-operator';
import { CreatePageGate } from 'shared/navigate';

const Page = () => (
  <CreatePageGate rule="CAN_CREATE_IDVTC">
    <CreateOperatorPage type={OPERATOR_TYPE.CSM_IDVTC} />
  </CreatePageGate>
);

export default Page;
