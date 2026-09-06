import { PATH } from 'consts/urls';
import { RewardsHistoryPage } from 'features/rewards-history';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.HOME} />}>
      <RewardsHistoryPage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
