import { HOME_PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
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
      <GateNodeOperator fallback={<CreateNodeOperatorPage />}>
        <AddKeysPage />
      </GateNodeOperator>
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
