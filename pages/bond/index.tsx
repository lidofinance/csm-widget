import { BOND_ADD_PATH, HOME_PATH } from 'consts/urls';
import { GateActiveUser, GateLoaded, Navigate } from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
    <GateLoaded fallback={<SplashPage />}>
      <Navigate path={BOND_ADD_PATH} />
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
