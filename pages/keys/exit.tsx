import { PATH } from 'consts/urls';
import { ExitKeysPage } from 'features/exit-keys';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.HOME} />}>
      <ExitKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
