import { secretConfig } from 'config';
import { HOME_temp, ROLES_INBOX_PATH } from 'consts/urls';
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
    <GateActiveUser fallback={<Navigate path={HOME_temp} />}>
      <GateNodeOperator fallback={<Navigate path={ROLES_INBOX_PATH} />}>
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
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return { props: { faqList: await faqList } };
};
