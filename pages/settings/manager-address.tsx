import { PATH } from 'consts/urls';
import { ManagerAddressPage } from 'features/change-role';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <ManagerAddressPage />
    </Gate>
  </GateLoaded>
);

export default Page;

