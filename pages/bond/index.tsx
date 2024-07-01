import { secretConfig } from 'config';
import { BOND_CLAIM_PATH, HOME_temp } from 'consts/urls';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_temp} />}>
      <Navigate path={BOND_CLAIM_PATH} />
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return { props: {} };
};
