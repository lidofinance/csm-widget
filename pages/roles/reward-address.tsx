import { HOME_PATH, ROLES_INBOX_PATH, ROLES_MANAGER_PATH } from 'consts/urls';
import { ChangeRewardRolePage } from 'features/change-role';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  GateRoleRewards,
} from 'shared/gates';
import { SplashPage } from 'features/welcome';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={ROLES_INBOX_PATH} />}>
        <GateRoleRewards fallback={<Navigate path={ROLES_MANAGER_PATH} />}>
          <ChangeRewardRolePage />
        </GateRoleRewards>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
