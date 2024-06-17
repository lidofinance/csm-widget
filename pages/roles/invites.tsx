import { HOME_PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { GateActiveUser, GateLoaded, Navigate } from 'features/gates';
import { SplashPage } from 'features/welcome';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <AcceptInvitePage />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
