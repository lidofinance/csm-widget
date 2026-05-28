import { PATH } from 'consts/urls';
import { GroupPage } from 'features/group';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { useNodeOperatorId } from 'modules/web3/operator-provider/node-operator-provider';
import { useOperatorGroup } from 'modules/web3/hooks/use-operator-group';

const Page = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isPending } = useOperatorGroup(nodeOperatorId);

  return (
    <GateLoaded additional={isPending}>
      <Gate rule="IS_CM" fallback={<Navigate path={PATH.HOME} />}>
        <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
          <GroupPage />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
