import { PATH } from 'consts/urls';
import { WrappedPage } from 'features/wrapped';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <Gate rule="IS_MAINNET" fallback={<Navigate path={PATH.HOME} />}>
        <WrappedPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
