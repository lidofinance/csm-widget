import { secretConfig } from 'config';
import { PATH } from 'consts/urls';
import { AddBondPage } from 'features/add-bond';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
      >
        <AddBondPage />
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
