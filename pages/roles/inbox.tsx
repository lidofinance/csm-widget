import { PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { SplashPage } from 'features/welcome';
import { getFaqRoles } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <AcceptInvitePage />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqRoles);
