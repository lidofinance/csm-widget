import { PATH } from 'consts/urls';
import { MyOperatorsPage } from 'features/my-operators';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <MyOperatorsPage />
    </Gate>
  </GateLoaded>
);

export default Page;
