import { SecretConfigType } from 'config';
import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { WelcomePage } from 'features/welcome';
import { MaintenancePage } from 'features/welcome/maintenance-page';
import { getProps } from 'utilsApi';
import { FC } from 'react';
import { Gate, GateLoaded } from 'shared/navigate';

type PageProps = Pick<SecretConfigType, 'maintenance' | 'defaultChain'>;

const Page: FC<PageProps> = ({ maintenance }) => {
  if (maintenance) return <MaintenancePage />;

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<WelcomePage />}>
        <Gate rule="IS_NODE_OPERATOR" fallback={<StarterPackPage />}>
          <DashboardPage />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps({
  continueAnyway: true,
});
