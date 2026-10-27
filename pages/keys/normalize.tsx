import { PATH } from 'consts/urls';
import { NormalizeQueuePage } from 'features/normalize-queue';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule="IS_CSM_FAMILY" fallback={<Navigate path={PATH.KEYS} />}>
        <NormalizeQueuePage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

