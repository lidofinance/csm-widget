import { PATH } from 'consts/urls';
import { AddBondPage } from 'features/add-bond';
import { getProps } from 'utils';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <AddBondPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
