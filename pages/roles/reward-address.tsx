import { PATH } from 'consts/urls';
import { ChangeRewardRolePage } from 'features/change-role';
import { getFaqRoles } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.ROLES} />}>
      <ChangeRewardRolePage />
    </Gate>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqRoles);
