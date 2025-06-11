import { PATH } from 'consts/urls';
import { ClaimTypePage } from 'features/claim-type';
import { getFaqMain } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <ClaimTypePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqMain);
