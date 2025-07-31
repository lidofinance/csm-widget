import { PATH } from 'consts/urls';
import { ViewKeysPage } from 'features/view-keys';
import { getProps } from 'utils';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <ViewKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
