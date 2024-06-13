import { HOME_PATH, KEYS_SUBMIT_PATH } from 'consts/urls';
import { GateActiveUser, GateLoaded, Navigate } from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
    <GateLoaded fallback={<SplashPage />}>
      <Navigate path={KEYS_SUBMIT_PATH} />
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
