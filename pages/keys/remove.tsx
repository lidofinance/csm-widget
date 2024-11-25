import { PATH } from 'consts/urls';
import { RemoveKeysPage } from 'features/remove-keys';
import { getFaqKeys } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_MANAGER_ROLE" fallback={<Navigate path={PATH.KEYS} />}>
      <RemoveKeysPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqKeys);
