import { PATH } from 'consts/urls';
import { TransferKeysPage } from 'features/transfer-keys';
import { getProps } from 'utils';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_KEYS_TO_TRANSFER" fallback={<Navigate path={PATH.KEYS} />}>
      <TransferKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
