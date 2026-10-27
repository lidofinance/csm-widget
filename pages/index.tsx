import { DashboardPage } from 'features/dashboard';
import { ValidatePage } from 'features/validate-with-lido';
import { FC } from 'react';
import { Gate, GateLoaded } from 'shared/navigate';

const Page: FC = () => {
  return (
    <GateLoaded>
      <Gate rule="HAS_ANY_ROLE" fallback={<ValidatePage />}>
        <DashboardPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;
