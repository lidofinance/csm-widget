import { HOME_PATH, KEYS_PATH } from 'consts/urls';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  Navigate,
} from 'features/gates';
import { RemoveKeysPage } from 'features/remove-keys';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
    <GateLoaded fallback={<SplashPage />}>
      <GateNodeOperator fallback={<Navigate path={KEYS_PATH} />}>
        <RemoveKeysPage />
      </GateNodeOperator>
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
