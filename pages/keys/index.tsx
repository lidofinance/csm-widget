import { PATH } from 'consts/urls';
import { SplashPage } from 'features/welcome';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <Navigate path={PATH.KEYS} fallback={<SplashPage />} />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
