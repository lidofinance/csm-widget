import { secretConfig } from 'config';
import { HOME_PATH, ROLES_INBOX_PATH } from 'consts/urls';
import {
  ChangeManagerRolePage,
  ResetManagerRolePage,
} from 'features/change-role';
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
      <GateNodeOperator fallback={<Navigate path={ROLES_INBOX_PATH} />}>
        <GateRoleManager fallback={<ResetManagerRolePage />}>
          <ChangeManagerRolePage />
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
