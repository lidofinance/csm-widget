import { PATH } from 'consts/urls';
import { getProps } from 'lib/getProps';
import { GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.KEYS} />
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
