import { secretConfig } from 'config';
import { HOME_PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <AcceptInvitePage />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return { props: {} };
};
