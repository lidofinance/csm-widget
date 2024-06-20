import { HOME_PATH, KEYS_VIEW_PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import {
  GateActiveUser,
  GateCanCreate,
  GateLoaded,
  GateNodeOperator,
  GateRoleManager,
} from 'shared/gates';
import { SplashPage } from 'features/welcome';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator
        fallback={
          <GateCanCreate fallback={<Navigate path={HOME_PATH} />}>
            <CreateNodeOperatorPage />
          </GateCanCreate>
        }
      >
        <GateRoleManager fallback={<Navigate path={KEYS_VIEW_PATH} />}>
          <AddKeysPage />
        </GateRoleManager>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
