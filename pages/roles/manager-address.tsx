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
  <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
    <GateLoaded fallback={<SplashPage />}>
      <GateNodeOperator fallback={<Navigate path={ROLES_INVITES_PATH} />}>
        <ChangeManagerRolePage />
      </GateNodeOperator>
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
