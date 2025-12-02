import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.TYPE_ICS_APPLY} />
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
