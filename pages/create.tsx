import { PATH } from 'consts/urls';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { getFaqKeys } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule={'IS_CONNECTED_WALLET'} fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule={'NOT_NODE_OPERATOR'} fallback={<Navigate path={PATH.KEYS} />}>
        <Gate rule={'CAN_CREATE'} fallback={<Navigate path={PATH.HOME} />}>
          <CreateNodeOperatorPage />
        </Gate>
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqKeys);
