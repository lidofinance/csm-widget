import { PATH } from 'consts/urls';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
      <Navigate path={PATH.TYPE_ICS_APPLY} />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
