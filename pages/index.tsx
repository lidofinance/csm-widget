import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { WelcomePage } from 'features/welcome';
import { FC } from 'react';
import { Gate, GateLoaded } from 'shared/navigate';
import { CmWelcomePage } from 'features/starter-pack/cm-welcome-page';

const Page: FC = () => (
  <GateLoaded>
    <Gate rule="IS_CONNECTED_WALLET" fallback={<WelcomePage />}>
      <Gate
        rule="HAS_ANY_ROLE"
        fallback={
          <>
            <Gate rule="IS_CM">
              <CmWelcomePage />
            </Gate>
            <Gate rule="IS_CSM_FAMILY">
              <StarterPackPage />
            </Gate>
          </>
        }
      >
        <DashboardPage />
      </Gate>
    </Gate>
  </GateLoaded>
);

export default Page;
