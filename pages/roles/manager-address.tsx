import { PATH } from 'consts/urls';
import { ChangeManagerRolePage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.ROLES} />}>
      <ChangeManagerRolePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
