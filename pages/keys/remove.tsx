import { PATH } from 'consts/urls';
import { RemoveKeysPage } from 'features/remove-keys';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_MANAGER_ROLE" fallback={<Navigate path={PATH.KEYS} />}>
      <RemoveKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
