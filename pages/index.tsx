import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { WelcomePage } from 'features/welcome';
import { FC } from 'react';
import { Gate, GateLoaded } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<WelcomePage />}>
        <Gate rule="HAS_ANY_ROLE" fallback={<StarterPackPage />}>
          <DashboardPage />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

