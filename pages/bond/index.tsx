import { PATH } from 'consts/urls';
import { BondRewardsPage } from 'features/bond-rewards';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <BondRewardsPage />
    </Gate>
  </GateLoaded>
);

export default Page;
