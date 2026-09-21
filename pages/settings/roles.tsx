import { PATH } from 'consts/urls';
import { RolesPage } from 'features/change-role';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <RolesPage />
    </Gate>
  </GateLoaded>
);

export default Page;

