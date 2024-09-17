import { PATH } from 'consts/urls';
import { ChangeManagerRolePage } from 'features/change-role';
import { SplashPage } from 'features/welcome';
import { getFaqRoles } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.ROLES} fallback={<SplashPage />} />}
      >
        <ChangeManagerRolePage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps = getProps(getFaqRoles);
