import { HOME_PATH, KEYS_SUBMIT_PATH } from 'consts/urls';
import { GateActiveUser, GateLoaded, Navigate } from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <Navigate path={KEYS_SUBMIT_PATH} />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
