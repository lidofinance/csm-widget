import { PATH } from 'consts/urls';
import { PerformancePage } from 'dappnode/performance/performance-page';
import { getFaqPerformance } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <PerformancePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getStaticProps = getProps(getFaqPerformance);
