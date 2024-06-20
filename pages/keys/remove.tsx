import { HOME_PATH, KEYS_PATH, KEYS_VIEW_PATH } from 'consts/urls';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  GateRoleManager,
} from 'shared/gates';
import { RemoveKeysPage } from 'features/remove-keys';
import { SplashPage } from 'features/welcome';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={KEYS_PATH} />}>
        <GateRoleManager fallback={<Navigate path={KEYS_VIEW_PATH} />}>
          <RemoveKeysPage />
        </GateRoleManager>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
