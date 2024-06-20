import { BOND_CLAIM_PATH, HOME_PATH } from 'consts/urls';
import { SplashPage } from 'features/welcome';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <Navigate path={BOND_CLAIM_PATH} />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
