import { PATH } from 'consts/urls';
import { SplitsPage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.HOME} />}>
      <SplitsPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
