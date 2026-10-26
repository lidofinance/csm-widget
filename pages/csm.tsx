import { PATH } from 'consts/urls';
import { CommunityStakingPage } from 'features/validate-with-lido';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="NOT_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
      <CommunityStakingPage />
    </Gate>
  </GateLoaded>
);

export default Page;
