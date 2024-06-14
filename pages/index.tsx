import { DashboardPage } from 'features/dashboard';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'features/gates';
import { StarterPackPage } from 'features/starter-pack';
import { SplashPage, WelcomePage } from 'features/welcome';

const Page = () => (
  <GateActiveUser fallback={<WelcomePage />}>
    <GateLoaded fallback={<SplashPage />}>
      <GateNodeOperator fallback={<StarterPackPage />}>
        <DashboardPage />
      </GateNodeOperator>
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
