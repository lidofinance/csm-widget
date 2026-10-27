import { PATH } from 'consts/urls';
import { SplitsPage } from 'features/change-role';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <SplitsPage />
    </Gate>
  </GateLoaded>
);

export default Page;

