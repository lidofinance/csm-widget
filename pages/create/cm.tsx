import { PATH } from 'consts/urls';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { useCanCreateNodeOperator } from 'shared/hooks';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  const { isPending } = useCanCreateNodeOperator();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <GateLoaded additional={isPending}>
          <Gate rule="CAN_CREATE_CM" fallback={<Navigate path={PATH.CREATE} />}>
            <CreateNodeOperatorPage />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

