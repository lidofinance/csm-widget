import { HOME_PATH } from 'consts/urls';
import { ClaimRewardsPage } from 'features/claim-rewards';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { SplashPage } from 'features/welcome';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={HOME_PATH} />}>
        <ClaimRewardsPage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
