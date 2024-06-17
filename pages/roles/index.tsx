import { HOME_PATH, ROLES_INVITES_PATH, ROLES_REWARDS_PATH } from 'consts/urls';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  Navigate,
} from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={ROLES_INVITES_PATH} />}>
        <Navigate path={ROLES_REWARDS_PATH} />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
