import { PATH } from 'consts/urls';
import { ExitKeysPage } from 'features/exit-keys';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utils';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <ExitKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
