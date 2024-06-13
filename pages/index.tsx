import { GateActiveUser, GateLoaded } from 'features/gates';
import { StarterPackPage } from 'features/starter-pack';
import { SplashPage, WelcomePage } from 'features/welcome';

const Page = () => (
  <GateActiveUser fallback={<WelcomePage />}>
    <GateLoaded fallback={<SplashPage />}>
      <StarterPackPage />
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
