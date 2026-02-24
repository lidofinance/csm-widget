import { PATH } from 'consts/urls';
import { GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <GateLoaded>
    <Navigate path={PATH.SETTINGS_ROLES} />
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
