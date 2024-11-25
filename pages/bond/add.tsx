import { PATH } from 'consts/urls';
import { AddBondPage } from 'features/add-bond';
import { getFaqBond } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <AddBondPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqBond);
