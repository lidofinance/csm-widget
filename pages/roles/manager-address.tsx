import { secretConfig } from 'config';
import { PATH } from 'consts/urls';
import {
  ChangeManagerRolePage,
  ResetManagerRolePage,
} from 'features/change-role';
import { SplashPage } from 'features/welcome';
import { getFaqList } from 'lib/faqList';
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
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.ROLES} fallback={<SplashPage />} />}
      >
        <GateRoleManager fallback={<ResetManagerRolePage />}>
          <ChangeManagerRolePage />
        </GateRoleManager>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

const faqList = getFaqList([
  'roles-what-are-rewards-and-manager-addresses',
  'roles-why-should-these-addresses-be-different',
  'roles-how-to-accept-a-new-address-request',
  'roles-what-to-do-if-the-change-is-submitted-to-a-wrong-address',
  'roles-what-happens-to-rewards-after-changing-the-address',
]);

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased, maintenance } = secretConfig;
  if (notReleased || maintenance) return { notFound: true };

  return { props: { faqList: await faqList } };
};
