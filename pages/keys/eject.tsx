import { PATH } from 'consts/urls';
import { EjectKeysPage } from 'features/eject-keys';
import { getProps } from 'utils';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_OWNER_ROLE" fallback={<Navigate path={PATH.KEYS} />}>
      <EjectKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
