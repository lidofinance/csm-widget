import { SecretConfigType } from 'config';
import { ECNoLogsPage } from 'dappnode/fallbacks/ec-no-logs-page';
import { ECNotInstalledPage } from 'dappnode/fallbacks/ec-not-installed-page';
import { ECSyncingPage } from 'dappnode/fallbacks/ec-syncing-page';
import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { WelcomePage } from 'features/welcome';
import { MaintenancePage } from 'features/welcome/maintenance-page';
import { getFaqMain } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { FC } from 'react';
import { Gate, GateLoaded } from 'shared/navigate';

type PageProps = Pick<SecretConfigType, 'maintenance'>;

const Page: FC<PageProps> = ({ maintenance }) => {
  if (maintenance) return <MaintenancePage />;

  return (
    // DAPPNODE GATES: IS_EXECUTION_INSTALLED, IS_EXECUTION_SYNCED, EXECUTION_HAS_LOGS
    <Gate rule="IS_EXECUTION_INSTALLED" fallback={<ECNotInstalledPage />}>
      <Gate rule="IS_EXECUTION_SYNCED" fallback={<ECSyncingPage />}>
        <Gate rule="EXECUTION_HAS_LOGS" fallback={<ECNoLogsPage />}>
          <GateLoaded>
            <Gate rule="IS_CONNECTED_WALLET" fallback={<WelcomePage />}>
              <Gate rule="IS_NODE_OPERATOR" fallback={<StarterPackPage />}>
                <DashboardPage />
              </Gate>
            </Gate>
          </GateLoaded>
        </Gate>
      </Gate>
    </Gate>
  );
};

export default Page;

export const getServerSideProps = getProps(getFaqMain, {
  continueAnyway: true,
});
