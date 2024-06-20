import { HOME_PATH, ROLES_INBOX_PATH } from 'consts/urls';
import {
  ChangeManagerRolePage,
  ResetManagerRolePage,
} from 'features/change-role';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  GateRoleManager,
} from 'shared/gates';
import { SplashPage } from 'features/welcome';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={ROLES_INBOX_PATH} />}>
        <GateRoleManager fallback={<ResetManagerRolePage />}>
          <ChangeManagerRolePage />
        </GateRoleManager>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
