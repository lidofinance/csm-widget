import { PATH } from 'consts/urls';
import { UnlockBondPage } from 'features/unlock-bond/unlock-bond-page';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.HOME} />}>
      <UnlockBondPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
