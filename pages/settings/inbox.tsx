import { PATH } from 'consts/urls';
import { AcceptInvitePage } from 'features/accept-invite';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
      <AcceptInvitePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
