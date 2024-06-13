import { HOME_PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { GateActiveUser, GateLoaded, Navigate } from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
    <GateLoaded fallback={<SplashPage />}>
      <AcceptInvitePage />
    </GateLoaded>
  </GateActiveUser>
);

export default Page;
