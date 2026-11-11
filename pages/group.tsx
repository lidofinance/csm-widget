import { PATH } from 'consts/urls';
import { GroupPage } from 'features/group';
import { useModule, useOperatorGroupId } from 'modules/web3';
import { useNodeOperatorId } from 'modules/web3/operator-provider/node-operator-provider';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId, isPending } = useOperatorGroupId({
    nodeOperatorId,
    module,
  });

  return (
    <GateLoaded>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <Gate rule="IS_CM" fallback={<Navigate path={PATH.MY_OPERATORS} />}>
          <GateLoaded additional={isPending}>
            {groupId && nodeOperatorId !== undefined ? (
              <GroupPage nodeOperatorId={nodeOperatorId} />
            ) : (
              <Navigate path={PATH.MY_OPERATORS} />
            )}
          </GateLoaded>
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;
