import { PATH } from 'consts/urls';
import { KeysPage } from 'features/view-keys';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.CREATE} />}>
      <KeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;
