import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.TYPE_ICS_APPLY} />
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
