import { PATH } from 'consts/urls';
import { MonitoringPage } from 'features/monitoring';
import { getFaqMonitoring } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <MonitoringPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqMonitoring);
