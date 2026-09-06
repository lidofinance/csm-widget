import { PATH } from 'consts/urls';
import { MonitoringPage } from 'features/monitoring';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.HOME} />}>
      <MonitoringPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
