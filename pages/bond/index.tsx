import { PATH } from 'consts/urls';
import { BondRewardsPage } from 'features/bond-rewards';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="HAS_ANY_ROLE" fallback={<Navigate path={PATH.BOND_CLAIM} />}>
      <BondRewardsPage />
    </Gate>
  </GateLoaded>
);

export default Page;
