import { PATH } from 'consts/urls';
import { MyOperatorsPage } from 'features/my-operators';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_CSM_FAMILY" fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <MyOperatorsPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
