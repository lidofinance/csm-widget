import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { ClaimIcsPage } from 'features/claim-type';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <ClaimIcsPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
