import { HOME_PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { SplashPage } from 'features/welcome';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <AcceptInvitePage />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;
