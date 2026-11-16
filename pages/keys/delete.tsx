import { PATH } from 'consts/urls';
import { DeleteKeysPage } from 'features/delete-keys';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.CREATE} />}>
      <DeleteKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;
