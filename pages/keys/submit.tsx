import { PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { getFaqKeys } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.CREATE} />}>
      <Gate rule="HAS_MANAGER_ROLE" fallback={<Navigate path={PATH.KEYS} />}>
        <AddKeysPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqKeys);
