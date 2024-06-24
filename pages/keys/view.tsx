import { secretConfig } from 'config';
import { HOME_PATH, KEYS_SUBMIT_PATH } from 'consts/urls';
import { ViewKeysPage } from 'features/view-keys';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={KEYS_SUBMIT_PATH} />}>
        <ViewKeysPage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return { props: {} };
};
