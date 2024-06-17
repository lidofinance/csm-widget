import { BOND_ADD_PATH, HOME_PATH } from 'consts/urls';
import { GateActiveUser, GateLoaded, Navigate } from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <Navigate path={BOND_ADD_PATH} />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
