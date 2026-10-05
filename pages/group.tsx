import { PATH } from 'consts/urls';
import { GroupPage } from 'features/group';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { useNodeOperatorId } from 'modules/web3/operator-provider/node-operator-provider';
import { useModule } from 'modules/web3';
import { useOperatorGroup } from 'modules/web3/hooks/use-operator-group';

const Page = () => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { isPending } = useOperatorGroup({ nodeOperatorId, module });

  return (
    <GateLoaded>
      <Gate rule="IS_CM" fallback={<Navigate path={PATH.HOME} />}>
        <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
          <GateLoaded additional={isPending}>
            <GroupPage />
          </GateLoaded>
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;
