import { secretConfig } from 'config';
import { HOME_PATH, KEYS_PATH, KEYS_VIEW_PATH } from 'consts/urls';
import { RemoveKeysPage } from 'features/remove-keys';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  GateRoleManager,
} from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator fallback={<Navigate path={KEYS_PATH} />}>
        <GateRoleManager fallback={<Navigate path={KEYS_VIEW_PATH} />}>
          <RemoveKeysPage />
        </GateRoleManager>
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
