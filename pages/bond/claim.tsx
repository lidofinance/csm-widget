import { HOME_PATH } from 'consts/urls';
import { ClaimBondPage } from 'features/claim-bond';
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
      <GateNodeOperator fallback={<Navigate path={HOME_PATH} />}>
        <ClaimBondPage />
      </GateNodeOperator>
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
