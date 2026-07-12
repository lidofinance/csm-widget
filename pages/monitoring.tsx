import { PATH } from 'consts/urls';
import { MonitoringPage } from 'features/monitoring';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.MONITORING}>
    <MonitoringPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
