import { SecretConfigType } from 'config';
import { PATH } from 'consts';
import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { CmWelcomePage } from 'features/starter-pack/cm-welcome-page';
import { WelcomePage } from 'features/welcome';
import { MaintenancePage } from 'features/welcome/maintenance-page';
import { FC } from 'react';
import { useShowRule } from 'shared/hooks';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

type PageProps = Pick<SecretConfigType, 'maintenance'>;

// Must render inside PageGate so its initial-load splash precedes the checks:
// during load the flags read as false and would flash WelcomePage
const HomeSwitch: FC = () => {
  const check = useShowRule();
  if (!check('IS_CONNECTED_WALLET')) return <WelcomePage />;
  if (check('IS_NODE_OPERATOR')) return <DashboardPage />;
  return check('IS_CM') ? <CmWelcomePage /> : <StarterPackPage />;
};

const Page: FC<PageProps> = ({ maintenance }) => {
  if (maintenance) return <MaintenancePage />;

  return (
    <PageGate path={PATH.HOME}>
      <HomeSwitch />
    </PageGate>
  );
};

export default Page;

export const getServerSideProps = getProps({
  continueAnyway: true,
});
