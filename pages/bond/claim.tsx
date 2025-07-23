import { PATH } from 'consts/urls';
import { ClaimBondPage } from 'features/claim-bond';
import { getProps } from 'utils';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <ClaimBondPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
