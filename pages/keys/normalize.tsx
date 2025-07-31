import { PATH } from 'consts/urls';
import { NormalizeQueuePage } from 'features/normalize-queue';
import { getProps } from 'utils';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <NormalizeQueuePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
