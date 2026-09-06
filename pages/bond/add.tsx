import { PATH } from 'consts/urls';
import { AddBondPage } from 'features/add-bond';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.HOME} />}>
      <AddBondPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
