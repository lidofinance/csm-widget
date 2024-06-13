import { HOME_PATH } from 'consts/urls';
import { ClaimRewardsPage } from 'features/claim-rewards';
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
        <ClaimRewardsPage />
      </GateNodeOperator>
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
