import { DashboardPage } from 'features/dashboard';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { StarterPackPage } from 'features/starter-pack';
import { SplashPage, WelcomePage } from 'features/welcome';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<WelcomePage />}>
      <GateNodeOperator fallback={<StarterPackPage />}>
        <DashboardPage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
