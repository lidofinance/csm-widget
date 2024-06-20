import { HOME_PATH, KEYS_SUBMIT_PATH, KEYS_VIEW_PATH } from 'consts/urls';
import { SplashPage } from 'features/welcome';
import { GateActiveUser, GateLoaded, GateRoleManager } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <Navigate path={KEYS_SUBMIT_PATH} />
      <GateRoleManager fallback={<Navigate path={KEYS_VIEW_PATH} />}>
        <Navigate path={KEYS_SUBMIT_PATH} />
      </GateRoleManager>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
