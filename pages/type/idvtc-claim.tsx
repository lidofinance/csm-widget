import { PATH } from 'consts/urls';
import { ClaimIdvtcPage } from 'features/claim-type';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <ClaimIdvtcPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
