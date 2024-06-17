import { HOME_PATH, ROLES_INVITES_PATH } from 'consts/urls';
import { ChangeManagerRolePage } from 'features/change-role';
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
        <ChangeManagerRolePage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
