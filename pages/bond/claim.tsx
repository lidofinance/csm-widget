import { secretConfig } from 'config';
import { HOME_PATH } from 'consts/urls';
import { ClaimBondPage } from 'features/claim-bond';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={HOME_PATH} />}>
        <ClaimBondPage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased, maintenance } = secretConfig;
  if (notReleased || maintenance) return { notFound: true };

  return { props: {} };
};
