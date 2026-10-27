import { PATH } from 'consts/urls';
import { RewardsHistoryPage } from 'features/rewards-history';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <RewardsHistoryPage />
    </Gate>
  </GateLoaded>
);

export default Page;

